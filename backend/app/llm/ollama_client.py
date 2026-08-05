import logging
from ollama import chat

from app.models.lesson import LessonResponse
from app.config import settings


logger = logging.getLogger(__name__)

def generate_response(prompt:str) -> str:
    logger.info("Sending request to Ollama using model: %s", settings.ollama_model)
    response = chat(
        model=settings.ollama_model,
        messages=[
            {"role": "user", "content": prompt}
        ],
        format = LessonResponse.model_json_schema()
    )
    logger.info("Received response from Ollama.")
    return response.message.content