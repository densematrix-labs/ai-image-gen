"""Application configuration."""
import json
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App
    APP_NAME: str = "AI Image Gen"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"
    
    # LLM Proxy (for image generation)
    LLM_PROXY_URL: str = "https://llm-proxy.densematrix.ai"
    LLM_PROXY_KEY: str = ""
    
    # Creem Payment
    CREEM_API_KEY: str = ""
    CREEM_WEBHOOK_SECRET: str = ""
    CREEM_PRODUCT_IDS: dict = {}
    
    # Products configuration
    PRODUCTS: dict = {
        "starter_10": {"price": 299, "generations": 10},
        "pro_50": {"price": 999, "generations": 50},
        "unlimited_monthly": {"price": 1499, "generations": 500},
    }
    
    # Free trial
    FREE_GENERATIONS_PER_DEVICE: int = 3
    
    # Tool name for metrics
    TOOL_NAME: str = "ai-image-gen"
    
    class Config:
        env_file = ".env"
        extra = "ignore"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CREEM_PRODUCT_IDS if it's a string
        if isinstance(self.CREEM_PRODUCT_IDS, str):
            try:
                self.CREEM_PRODUCT_IDS = json.loads(self.CREEM_PRODUCT_IDS)
            except:
                self.CREEM_PRODUCT_IDS = {}


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
