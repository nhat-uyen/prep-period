from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ollama_model: str = "qwen2-math"
    ollama_host: str = "http://localhost:11434"
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()