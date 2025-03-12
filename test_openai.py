import os
import openai

# Set API Key from Environment Variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Make a request to OpenAI API using the latest format
response = openai.ChatCompletion.create(
    model="gpt-4",  # Use "gpt-3.5-turbo" if needed
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

# Print the response correctly
print(response["choices"][0]["message"]["content"])
