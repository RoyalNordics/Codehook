import openai
import os

# Set API Key from Environment Variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Make a request to OpenAI API
response = openai.ChatCompletion.create(
    model="gpt-4",  # or "gpt-3.5-turbo"
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

# Print the response
print(response)
