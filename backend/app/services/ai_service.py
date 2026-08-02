'''
This module contains functions to build prompts for AI services.
'''
import ollama
from ollama import chat

def generate_response(prompt:str) -> str:
    response = chat(
        model="llama3.2",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.message.content

def build_prompt(subject, topic, grade, duration_minutes):
    prompt = f"""
    You are an experienced {grade} grade teacher.
    Create a {duration_minutes}-minute lesson.
    Subject: {subject}
    Topic: {topic}
    
    Include:
    1. Learning goals
    2. Materials
    3. Warm-up activity
    4. Teacher modeling and explanation
    5. Guided practice
    6. Independent practice
    7. Assessment and feedback
    
    Return the lesson in Markdown format with clear headings for each section.
    """
    return prompt