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

