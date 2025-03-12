import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.langchain_handler import CodeHookHandler

app = FastAPI()
codehook_handler = CodeHookHandler()

# Enable CORS (Security: Change "*" to your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store logs of received webhook requests
logs = []

@app.get("/")
def root():
    return {"message": "FastAPI is running!"}

@app.get("/config")
def get_config():
    return {
        "webhook_url": "https://your-webhook-url.onrender.com",
        "allowed_chat_id": "1234567890",
        "ai_platform": "openai",
    }  # Removed API keys for security

@app.post("/api/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        message = data.get("message", "")

        # Store the received message in logs
        logs.append(data)
        print(f"Received webhook message: {message}")

        return JSONResponse({
            "status": "success", 
            "received": message,
            "generatedCode": "console.log('Hello from CodeHook!');"
        })
    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/logs")
def get_logs():
    return logs if logs else {"details": "No logs available"}

@app.post("/receive-message")
async def receive_message(request: Request):
    data = await request.json()
    message = data.get("message", "")
    preferred_filename = data.get("filename", None)
    preferred_path = data.get("path", None)

    # Use our handler to process the message
    result = codehook_handler.process_ai_message(
        message, 
        preferred_filename, 
        preferred_path
    )
    
    if result["status"] == "success":
        print(f"Successfully wrote code to {result['file_path']}")
        return {
            "status": "success", 
            "message": f"Code written to {result['file_path']}", 
            "file_path": result['file_path']
        }
    elif result["status"] == "ignored":
        return {"status": "ignored", "message": "Message doesn't contain CodeHook trigger"}
    else:
        return {"status": "error", "message": result["message"]}
