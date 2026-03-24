from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite+aiosqlite:///./browserforge.db"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # JWT
    jwt_secret: str = "your-super-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiry_days: int = 7

    # Docker
    docker_host: str = "unix:///var/run/docker.sock"
    sandbox_cpu_limit: float = 0.5
    sandbox_memory_limit: str = "512m"
    sandbox_timeout: int = 300  # seconds

    # AI Providers
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Deployment
    vercel_token: str = ""
    vercel_team_id: str = ""
    netlify_token: str = ""

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache
def get_settings() -> Settings:
    return Settings()
