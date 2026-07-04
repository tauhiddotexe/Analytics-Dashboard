import asyncio, selectors, urllib.request, json, os

asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

url = "http://localhost:8000/api/v1/health"
resp = urllib.request.urlopen(url, timeout=15)
data = json.loads(resp.read())
print(f"Response: {data}")
assert data["success"] is True
assert data["data"]["status"] == "healthy"
print("OK")
