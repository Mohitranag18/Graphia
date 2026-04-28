import asyncio
import os
from decouple import Config, RepositoryEnv

env_path = '/home/mohitrana/Desktop/Graphia/backend/.env'
config = Config(RepositoryEnv(env_path))
redis_url = config('REDIS_URL')

print(f"Testing Redis URL: {redis_url}")

async def test_redis():
    import redis.asyncio as redis
    try:
        r = redis.from_url(redis_url)
        ping_res = await r.ping()
        print(f"Ping successful: {ping_res}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test_redis())
