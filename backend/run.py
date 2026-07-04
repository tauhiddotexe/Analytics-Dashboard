import asyncio, os, sys
# Must be set before uvicorn creates its event loop
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import uvicorn
os.chdir(os.path.dirname(os.path.abspath(__file__)))
uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
