import asgiref.sync
from channels_redis.core import RedisChannelLayer
import time
from decouple import config

redis_url = config('REDIS_URL')

async def test_layer(layer_config, name):
    layer = RedisChannelLayer(**layer_config)
    print(f"Testing channel layer add for {name}...")
    start = time.time()
    try:
        await layer.group_add('test_group', 'test_channel')
        end = time.time()
        print(f"{name} group_add successful! Took {end-start} seconds.")
    except Exception as e:
        end = time.time()
        print(f"{name} group_add failed: {e}. Took {end-start} seconds.")

async def main():
    await test_layer({"hosts": [redis_url]}, "default")
    await test_layer({"hosts": [redis_url + "?ssl_cert_reqs=none"]}, "ssl_none")

asgiref.sync.async_to_sync(main)()
