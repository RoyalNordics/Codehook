from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running!"}

@app.get("/config")
def get_config():
    return {
        "webhook_url": "https://your-webhook-url.onrender.com",
        "allowed_chat_id": "1234567890",
        "api_key": "your-secure-api-key",
        "ai_platform": "openai",
        "openai_key": "your-openai-api-key",
        "claude_key": "your-claude-api-key"
    }
