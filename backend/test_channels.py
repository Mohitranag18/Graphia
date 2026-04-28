import asgiref.sync
import channels.layers
import time

channel_layer = channels.layers.get_channel_layer()

async def test_layer():
    print("Testing channel layer add...")
    start = time.time()
    try:
        await channel_layer.group_add('test_group', 'test_channel')
        end = time.time()
        print(f"group_add successful! Took {end-start} seconds.")
    except Exception as e:
        end = time.time()
        print(f"group_add failed: {e}. Took {end-start} seconds.")

asgiref.sync.async_to_sync(test_layer)()
