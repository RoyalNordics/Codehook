import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.langchain_handler import CodeHookHandler
from dotenv import load_dotenv
import requests

#Load .env file
load_dotenv()

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

# Get secrets from Environmental variables
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
AI_API_KEY = os.getenv("AI_API_KEY")
AI_PLATFORM = os.getenv("AI_PLATFORM")

# Store logs of received webhook requests
logs = []

@app.get("/")
def root():
    return {"message": "FastAPI is running!"}

@app.get("/config")
def get_config():
    #Return backend configs
    return {
        "webhook_url": WEBHOOK_URL,
        "ai_platform": AI_PLATFORM,
    }  # Removed API keys for security

@app.post("/api/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        generated_text = data.get("generated_text", "")  # Changed to generated_text

        # Store the received message in logs
        logs.append(data)
        print(f"Received webhook message: {generated_text}")

        return JSONResponse({
            "status": "success",
            "received": generated_text,
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

@app.post("/sendData")
async def sendData(request: Request):
  data = await request.json()

  WEBHOOK_URL = os.getenv("WEBHOOK_URL")
  AI_API_KEY = os.getenv("AI_API_KEY")
  #Instead of codeorPrompt, we get generated_text!
  codeOrPrompt = data.get("generated_text", "")

  #Construct payload
  payload = {
    "generated_text": codeOrPrompt,  # Include the generated text and the API key
    "api_key": AI_API_KEY
  }

  try:
      # Make the POST request
      response = requests.post(WEBHOOK_URL, json=payload)

      # Raise an exception for bad status codes
      response.raise_for_status()

      # Parse the JSON response
      json_response = response.json()

      # Handle the successful response
      print("Data sent successfully!")
      print(f"Response: {json_response}")

      # Return the JSON response
      return json_response

  except requests.exceptions.RequestException as e:
      # Handle any request-related errors
      error_message = f"Request failed: {e}"
      print(error_message)
      return {"status": "error", "message": error_message}
  except Exception as e:
      # Handle any other exceptions
      error_message = f"An unexpected error occurred: {e}"
      print(error_message)
      return {"status": "error", "message": error_message}
