from typing import Optional, Dict
from fastapi import WebSocket
from authx.exceptions import AuthXException
from jose import jwt
import decouple


async def get_websocket_auth(
    websocket: WebSocket,
    security: any = None,
) -> Optional[Dict[str, str]]:
    """Аутентификация WebSocket соединения через токен из cookies или query параметра
    Возвращает словарь с user_id и username"""
    try:
        secret_key = decouple.config("SECRET_KEY")
        
        token = websocket.cookies.get("access_token")
        token_source = "cookies"
        
        if not token:
            query_params = dict(websocket.query_params)
            token = query_params.get("token")
            token_source = "query"
        
        if not token:
            print("WebSocket auth: No token found in cookies or query")
            await websocket.close(code=1008, reason="Unauthorized: No token")
            return None

        print(f"WebSocket auth: Token found in {token_source}")
        
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("sub") or payload.get("uid")
        username = payload.get("username") or f"User_{user_id[:8]}" if user_id else "Unknown"

        if not user_id:
            print(f"WebSocket auth: Invalid user_id in token payload: {payload}")
            await websocket.close(code=1008, reason="Unauthorized: Invalid user")
            return None

        print(f"WebSocket auth: Authenticated user_id: {user_id}, username: {username}")
        return {"user_id": user_id, "username": username}

    except jwt.ExpiredSignatureError:
        print("WebSocket auth: Token expired")
        await websocket.close(code=1008, reason="Token expired")
        return None
    except jwt.JWTError as e:
        print(f"WebSocket auth: JWTError: {str(e)}")
        await websocket.close(code=1008, reason=f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        print(f"WebSocket auth: Exception: {str(e)}")
        await websocket.close(code=1011, reason=f"Authentication error: {str(e)}")
        return None