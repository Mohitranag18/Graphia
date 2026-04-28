import asyncio
import websockets
import jwt
import os
from decouple import Config, RepositoryEnv

env_path = '/home/mohitrana/Desktop/Graphia/backend/.env'
config = Config(RepositoryEnv(env_path))
SECRET_KEY = config('SECRET_KEY')

token = jwt.encode({'username': 'mohitGehu'}, SECRET_KEY, algorithm='HS256')

async def connect_ws():
    url = "ws://127.0.0.1:8001/ws/private/gaurav/"
    headers = {
        "Cookie": f"access_token={token}"
    }
    
    print(f"Connecting to {url} with token: {token}")
    try:
        async with websockets.connect(url, additional_headers=headers) as websocket:
            print("Connected successfully!")
            await asyncio.sleep(2)
            await websocket.close()
            print("Closed successfully.")
    except Exception as e:
        print(f"Failed to connect: {e}")

asyncio.run(connect_ws())
