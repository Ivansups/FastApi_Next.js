from fastapi import Depends, FastAPI, HTTPException
from authx import AuthX, AuthXConfig
import os
from datetime import timedelta
from models.user import User
import decouple
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from business.generate_data import generate_data
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
    if credentials.username == "admin" and credentials.password == "admin":
        token = security.create_access_token(uid='123')
        response.set_cookie(config.JWT_ACCESS_COOKIE_NAME, token)
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/protected")
async def protected(current_user = Depends(security.access_token_required)):
    return {
        "message": "Protected route",
        "user": current_user
    }

@app.get("/data")
def get_data(current_user = Depends(security.access_token_required)):
    return {
        "message": "Data fetched successfully",
        "data": generated_data
    }