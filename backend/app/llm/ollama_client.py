import logging
from ollama import chat
from collections.abc import Iterator
from app.models.lesson import LessonResponse
from app.config import settings


logger = logging.getLogger(__name__)
# non-streaming response
def generate_response(prompt:str) -> str:
    logger.info("Sending request to Ollama using model: %s", settings.ollama_model)
    response = chat(
        model=settings.ollama_model,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        # format allows repsonse to be in a certain structure
        format = LessonResponse.model_json_schema()
    )
    logger.info("Received response from Ollama.")
    return response.message.content

# streaming respsonse
def generate_streaming_response(prompt: str) -> Iterator[str]:
    response = chat (
        model=settings.ollama_model,
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        format=LessonResponse.model_json_schema(),
        options={'temperature': 0},
    )
    for part in response:
                content = part.message.content
                if content:
                        yield content