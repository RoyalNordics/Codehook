import os
import openai
import requests

# Load API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def send_message_to_openai(user_input):
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_input}],
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "send_to_codehook",
                    "description": "Send message to CodeHook for processing",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "message": {"type": "string", "description": "The AI-generated instruction"},
                        },
                        "required": ["message"],
                    },
                },
            }
        ],
        tool_choice="auto",
    )

    function_response = response.choices[0].message.tool_calls
    if function_response:
        message_content = function_response[0].function.arguments  # This should be a string

        if message_content:
            # Send to CodeHook
            requests.post("http://localhost:8000/receive-message", json={"message": message_content})
            return "Message sent to CodeHook!"
    
    return "No function call triggered."

print(send_message_to_openai("Hey CodeHook, generate a signup form"))
