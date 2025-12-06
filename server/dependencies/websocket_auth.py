from typing import Optional
from fastapi import WebSocket
from authx.exceptions import AuthXException
from authx import AuthX

async def get_websocket_auth(
    websocket: WebSocket,
    security: AuthX,
) -> Optional[str]:

    try:
        token = websocket.cookies.get("access_token")

        if not token:
            await websocket.close(code=1008, reason="Unauthorized")
            return None

        payload = security.decode_token(token)
        user_id = payload.get("sub") or payload.get("uid")

        if not user_id:
            await websocket.close(code=1008, reason="Unauthorized")
            return None

        return user_id

    except AuthXException as e:
        # Токен невалидный или истек
        await websocket.close(code=1008, reason=f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        # Другая ошибка
        await websocket.close(code=1011, reason=f"Authentication error: {str(e)}")
        return None