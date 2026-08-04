from app.models.lesson import LessonResponse

# a Pydantic feature is to produce a JSON schema from the model; hence, we can generate a JSON schema for the LessonResponse model
schema = LessonResponse.model_json_schema()