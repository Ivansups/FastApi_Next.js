from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.responses import JSONResponse
from authx import AuthX, AuthXConfig
from authx.exceptions import (
    JWTDecodeError, 
    TokenError, 
    TokenRequiredError,
    MissingTokenError,
    InvalidToken,
    AuthXException
)
import os
from datetime import timedelta, datetime
import decouple
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from server.models.user import User
from server.business.generate_data import generate_data
import uuid
from fastapi import WebSocket, WebSocketDisconnect
from server.dependencies.websocket_auth import get_websocket_auth
from server.clases.WebSocketManager import WebSocketManager

app = FastAPI()

@app.exception_handler(JWTDecodeError)
@app.exception_handler(TokenError)
@app.exception_handler(TokenRequiredError)
@app.exception_handler(MissingTokenError)
@app.exception_handler(InvalidToken)
@app.exception_handler(AuthXException)
async def auth_exception_handler(request: Request, exc: AuthXException):
    """Обработка ошибок аутентификации - возвращает понятные сообщения вместо трейсбеков"""
    error_message = str(exc).lower()
    
    # Определяем тип ошибки и возвращаем понятное сообщение
    if "expired" in error_message or "exp" in error_message:
        detail = "Токен доступа истёк. Пожалуйста, войдите в систему снова."
    elif "missing" in error_message or "required" in error_message:
        detail = "Токен доступа отсутствует. Пожалуйста, войдите в систему."
    elif "invalid" in error_message or "decode" in error_message:
        detail = "Недействительный токен доступа. Пожалуйста, войдите в систему."
    else:
        detail = "Ошибка аутентификации. Пожалуйста, войдите в систему."
    
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "error": "Authentication Error",
            "detail": detail,
            "type": "auth_error"
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generated_data = [generate_data() for _ in range(100)]

config = AuthXConfig()
config.JWT_SECRET_KEY = decouple.config("SECRET_KEY")
config.JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies", "headers"]

security = AuthX(config=config)

# Создаем единственный экземпляр WebSocketManager для всего приложения
websocket_manager = WebSocketManager()

@app.get("/")
def main_func():
    return {"message": "Hello, World!"}

@app.post("/login")
def login(credentials: User, response: Response):
    if credentials.username == "1" and credentials.password == "1":
        user_id = str(uuid.uuid4()) # ПРОСТО ИМИТАЦИЯ, В РЕАЛЬНОМ ПРОЕКТЕ ТУТ БУДЕТ ПОЛЬЗОВАТЕЛЬСКИЙ ID
        token = security.create_access_token(uid=user_id, additional_claims={"username": credentials.username})
        response.set_cookie(
            config.JWT_ACCESS_COOKIE_NAME, 
            token,
            httponly=True,  # Защита от XSS
            samesite='lax',  # Для работы с CORS
            secure=False,  # True in production with HTTPS
            max_age=86400  # 1 день в секундах
        )
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/protected")
async def protected(current_user = Depends(security.access_token_required)):
    if isinstance(current_user, dict):
        user_id = current_user.get('sub') or current_user.get('uid') or 'unknown'
    elif hasattr(current_user, 'sub'):
        user_id = current_user.sub
    elif hasattr(current_user, 'uid'):
        user_id = current_user.uid
    else:
        user_id = str(current_user) if current_user else 'unknown'
    
    return {
        "message": "Protected route",
        "user": user_id
    }

@app.get("/data")
def get_data(
    page: int = Query(1, ge=1, description="Номер страницы (начинается с 1)"),
    limit: int = Query(10, ge=1, le=100, description="Количество элементов на странице (максимум 100)"),
    current_user = Depends(security.access_token_required)
):
    total = len(generated_data)
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    
    if page > total_pages and total_pages > 0:
        raise HTTPException(
            status_code=404, 
            detail=f"Страница {page} не найдена. Всего страниц: {total_pages}"
        )
    
    start = (page - 1) * limit
    end = start + limit
    paginated_data = generated_data[start:end]
    
    return {
        "data": paginated_data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": total_pages,
            "hasNext": page < total_pages,
            "hasPrev": page > 1
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint с аутентификацией и обработкой сообщений
    
    Поддерживаемые типы сообщений:
    - "message" - отправка сообщения всем пользователям (требует поле "message")
    - "ping" - проверка соединения (ответ "pong")
    - "clear" - очистка истории чата для всех пользователей
    - "disconnect" - отключение от сервера
    """
    await websocket.accept()
    
    auth_data = await get_websocket_auth(websocket, security)
    if not auth_data:
        return
    
    user_id = auth_data["user_id"]
    username = auth_data["username"]
    
    await websocket_manager.connect(websocket, user_id, username)

    try:
        while True:
            message = await websocket.receive_json()
            
            message_type = message.get("type")
            
            if message_type == "message":
                content = message.get("content") or message.get("message", "")
                if content:
                    await websocket_manager.send_message_to_all(
                        content,
                        user_id,
                        username
                    )
                    await websocket.send_json({
                        "type": "message",
                        "message": content,
                        "sender_id": user_id,
                        "sender_username": username,
                        "is_self": True,
                        "timestamp": datetime.now().isoformat()
                    })
                
            elif message_type == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": message.get("timestamp")
                })
                
            elif message_type == "clear":
                await websocket_manager.clear_history(user_id, username)
                
            elif message_type == "disconnect":
                break
                
            else:
                await websocket.send_json({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                    "supported_types": ["message", "ping", "clear", "disconnect"]
                })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
    finally:
        await websocket_manager.disconnect(websocket)
