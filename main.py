from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (Security: Change "*" to your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/config")
def get_config():
    return {
        "webhook_url": "https://your-webhook-url.onrender.com",
        "allowed_chat_id": "1234567890",
        "ai_platform": "openai",
    }  # Removed API keys for security


from fastapi import Request
from fastapi.responses import JSONResponse

@app.post("/api/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        message = data.get("message", "")
        
        # Log the received message
        print(f"Received webhook message: {message}")
        
        # Here you would process the message with LangChain
        # For now, we'll just return a simple response
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
