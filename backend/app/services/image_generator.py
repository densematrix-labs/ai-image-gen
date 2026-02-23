"""Image generation service using LLM Proxy."""
import httpx
import logging
from typing import Optional

from app.core.config import settings
from app.schemas.generation import StylePreset

logger = logging.getLogger(__name__)


STYLE_PROMPTS = {
    StylePreset.REALISTIC: "photorealistic, highly detailed, 8k, professional photography",
    StylePreset.ANIME: "anime style, vibrant colors, detailed lineart, studio ghibli inspired",
    StylePreset.DIGITAL_ART: "digital art, concept art, artstation, trending",
    StylePreset.OIL_PAINTING: "oil painting, classical art style, impressionist, textured brushstrokes",
    StylePreset.WATERCOLOR: "watercolor painting, soft colors, artistic, flowing",
    StylePreset.SKETCH: "pencil sketch, detailed linework, artistic, black and white",
    StylePreset.CYBERPUNK: "cyberpunk style, neon lights, futuristic, sci-fi",
    StylePreset.FANTASY: "fantasy art, magical, ethereal, epic, detailed",
}


async def generate_image(prompt: str, style: Optional[StylePreset] = None) -> dict:
    """
    Generate an image using LLM Proxy's image generation endpoint.
    
    Args:
        prompt: The text description for the image
        style: Optional style preset to apply
        
    Returns:
        dict with 'success', 'image_url' or 'error'
    """
    # Enhance prompt with style
    enhanced_prompt = prompt
    if style and style in STYLE_PROMPTS:
        enhanced_prompt = f"{prompt}, {STYLE_PROMPTS[style]}"
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.LLM_PROXY_URL}/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {settings.LLM_PROXY_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "dall-e-3",
                    "prompt": enhanced_prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "quality": "standard",
                }
            )
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"LLM Proxy error: {response.status_code} - {error_text}")
                return {
                    "success": False,
                    "error": f"Image generation failed: {error_text}"
                }
            
            data = response.json()
            
            # Extract image URL from response
            if "data" in data and len(data["data"]) > 0:
                image_url = data["data"][0].get("url") or data["data"][0].get("b64_json")
                if image_url:
                    return {
                        "success": True,
                        "image_url": image_url
                    }
            
            return {
                "success": False,
                "error": "No image URL in response"
            }
            
    except httpx.TimeoutException:
        logger.error("Image generation timed out")
        return {
            "success": False,
            "error": "Image generation timed out. Please try again."
        }
    except Exception as e:
        logger.exception("Image generation error")
        return {
            "success": False,
            "error": str(e)
        }
