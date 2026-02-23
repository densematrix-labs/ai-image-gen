"""Image generation schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class StylePreset(str, Enum):
    """Available style presets."""
    REALISTIC = "realistic"
    ANIME = "anime"
    DIGITAL_ART = "digital_art"
    OIL_PAINTING = "oil_painting"
    WATERCOLOR = "watercolor"
    SKETCH = "sketch"
    CYBERPUNK = "cyberpunk"
    FANTASY = "fantasy"


class GenerateImageRequest(BaseModel):
    """Request to generate an image."""
    prompt: str = Field(..., min_length=1, max_length=1000, description="Image description")
    style: Optional[StylePreset] = Field(default=None, description="Style preset")
    device_id: str = Field(..., description="Device fingerprint for tracking")
    token: Optional[str] = Field(default=None, description="Payment token for paid generations")


class GenerateImageResponse(BaseModel):
    """Response with generated image."""
    success: bool
    image_url: Optional[str] = None
    remaining_generations: Optional[int] = None
    is_free_trial: bool = False
    error: Optional[str] = None


class GenerationStatus(BaseModel):
    """Status of image generation."""
    id: str
    status: Literal["pending", "processing", "completed", "failed"]
    image_url: Optional[str] = None
    error_message: Optional[str] = None


class UsageInfo(BaseModel):
    """Usage information for a device."""
    free_remaining: int
    paid_remaining: int
    total_remaining: int
