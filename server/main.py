from fastapi import Depends, FastAPI, HTTPException
from authx import AuthX, AuthXConfig
import os
from datetime import timedelta
from models.user import User
import decouple
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from business.generate_data import generate_data
import uuid
app = FastAPI()

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

@app.get("/")
def main_func():
    return {"message": "Hello, World!"}

@app.post("/login")
def login(credentials: User, response: Response):
    if credentials.username == "1" and credentials.password == "1":
        user_id = str(uuid.uuid4()) # ПРОСТО ИМИТАЦИЯ, В РЕАЛЬНОМ ПРОЕКТЕ ТУТ БУДЕТ ПОЛЬЗОВАТЕЛЬСКИЙ ID
        token = security.create_access_token(uid=user_id)
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
def get_data(current_user = Depends(security.access_token_required)):
    return {
        "message": "Data fetched successfully",
        "data": generated_data
    }