from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ollama_model: str = "llama3.2"
    ollama_host: str = "http://localhost:11434"
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()