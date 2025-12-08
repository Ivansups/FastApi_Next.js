from datetime import datetime

from fastapi import WebSocket


class ChatMessage:
    def __init__(
        self, message: str, sender_id: str, sender_username: str, timestamp: datetime = None
    ):
        self.message = message
        self.sender_id = sender_id
        self.sender_username = sender_username
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            "message": self.message,
            "sender_id": self.sender_id,
            "sender_username": self.sender_username,
            "timestamp": self.timestamp.isoformat()
        }

class WebSocketManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.websocket_to_user: dict[WebSocket, str] = {}
        self.user_info: dict[str, dict[str, str]] = {}
        self.chat_history: list[ChatMessage] = []
        self.max_history = 100

    async def connect(self, websocket: WebSocket, user_id: str, username: str):
        if user_id in self.active_connections:
            old_websocket = self.active_connections[user_id]
            try:
                await old_websocket.close(code=1000, reason="New login detected")
            except Exception:
                pass
            self.websocket_to_user.pop(old_websocket, None)

        self.active_connections[user_id] = websocket
        self.websocket_to_user[websocket] = user_id
        self.user_info[user_id] = {"username": username}

        try:
            await websocket.send_json({
                "type": "connection",
                "status": "authenticated",
                "user_id": user_id,
                "username": username
            })

            if self.chat_history:
                await websocket.send_json({
                    "type": "history",
                    "messages": [msg.to_dict() for msg in self.chat_history]
                })
        except Exception as e:
            print(f"Error sending connection message: {e}")

    async def disconnect(self, websocket: WebSocket):
        user_id = self.websocket_to_user.pop(websocket, None)
        if user_id and user_id in self.active_connections:
            del self.active_connections[user_id]
            self.user_info.pop(user_id, None)
        try:
            await websocket.close(code=1000, reason="Disconnected")
        except Exception:
            pass

    async def send_message_to_user(self, message: str, user_id: str, sender_username: str):
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json({
                    "type": "message",
                    "message": message,
                    "sender_id": user_id,
                    "sender_username": sender_username
                })
            except Exception:
                pass

    async def send_message_to_all(self, message: str, sender_id: str, sender_username: str):
        """Отправляет сообщение всем подключенным пользователям, кроме отправителя"""
        chat_msg = ChatMessage(message, sender_id, sender_username)
        self.chat_history.append(chat_msg)

        if len(self.chat_history) > self.max_history:
            self.chat_history = self.chat_history[-self.max_history:]

        for user_id, websocket in self.active_connections.items():
            if user_id != sender_id:
                try:
                    await websocket.send_json({
                        "type": "message",
                        "message": message,
                        "sender_id": sender_id,
                        "sender_username": sender_username,
                        "timestamp": chat_msg.timestamp.isoformat()
                    })
                except Exception:
                    pass

    async def clear_history(self, cleared_by_id: str, cleared_by_username: str):
        """Очищает историю чата и уведомляет всех пользователей"""
        self.chat_history = []

        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json({
                    "type": "clear_history",
                    "cleared_by": cleared_by_username,
                    "cleared_by_id": cleared_by_id
                })
            except Exception:
                pass

    def get_connected_count(self) -> int:
        """Возвращает количество подключенных пользователей"""
        return len(self.active_connections)
