'''
This module contains functions to build prompts for AI services.
'''

from ollama import chat

def generate_response(prompt:str) -> str:
    response = chat(
        model="llama3.2",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.message.content