from fastapi import WebSocket
from typing import Dict

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.websocket_to_user: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.websocket_to_user[websocket] = user_id
        await websocket.send_json({
            "type": "connection",
            "status": "authenticated",
            "user_id": user_id
        })

    async def disconnect(self, websocket: WebSocket):
        user_id = self.websocket_to_user.pop(websocket, None)
        if user_id and user_id in self.active_connections:
            del self.active_connections[user_id]
        try:
            await websocket.close(code=1000, reason="Disconnected")
        except Exception:
            pass
        if user_id:
            try:
                await websocket.send_json({
                    "type": "connection",
                    "status": "disconnected",
                    "user_id": user_id
                })
            except Exception:
                pass

    async def send_message_to_user(self, message: str, user_id: str):
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json({
                    "type": "message",
                    "message": message,
                    "user_id": user_id
                })
            except Exception:
                pass

    async def send_message_to_all(self, message: str):
        for websocket in self.active_connections.values():
            try:
                await websocket.send_json({
                    "type": "message",
                    "message": message,
                })
            except Exception:
                pass