"""Generation Models — Track image generations and free trials."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text

from app.core.database import Base


class FreeTrialUsage(Base):
    """Track free trial usage per device."""
    __tablename__ = "free_trial_usage"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String(255), unique=True, nullable=False, index=True)
    used_count = Column(Integer, default=0)
    first_used_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ImageGeneration(Base):
    """Record of generated images."""
    __tablename__ = "image_generations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String(255), index=True)
    token_id = Column(String(36), nullable=True)
    prompt = Column(Text, nullable=False)
    model = Column(String(50), nullable=False)
    style = Column(String(50))
    image_url = Column(Text)
    status = Column(String(20), default="pending")
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
