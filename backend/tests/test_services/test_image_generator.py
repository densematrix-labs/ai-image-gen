"""Tests for image generator service."""
import pytest
from unittest.mock import patch, AsyncMock, MagicMock

from app.services.image_generator import generate_image, STYLE_PROMPTS
from app.schemas.generation import StylePreset


@pytest.mark.asyncio
async def test_generate_image_success():
    """Test successful image generation."""
    with patch("httpx.AsyncClient") as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": [{"url": "https://example.com/generated.png"}]
        }
        
        mock_client_instance = AsyncMock()
        mock_client_instance.post.return_value = mock_response
        mock_client_instance.__aenter__.return_value = mock_client_instance
        mock_client_instance.__aexit__.return_value = None
        mock_client.return_value = mock_client_instance
        
        result = await generate_image("A sunset")
        
        assert result["success"] == True
        assert result["image_url"] == "https://example.com/generated.png"


@pytest.mark.asyncio
async def test_generate_image_with_style():
    """Test image generation with style enhancement."""
    with patch("httpx.AsyncClient") as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": [{"url": "https://example.com/anime.png"}]
        }
        
        mock_client_instance = AsyncMock()
        mock_client_instance.post.return_value = mock_response
        mock_client_instance.__aenter__.return_value = mock_client_instance
        mock_client_instance.__aexit__.return_value = None
        mock_client.return_value = mock_client_instance
        
        result = await generate_image("A warrior", StylePreset.ANIME)
        
        assert result["success"] == True
        # Verify style was added to prompt
        call_args = mock_client_instance.post.call_args
        sent_prompt = call_args[1]["json"]["prompt"]
        assert STYLE_PROMPTS[StylePreset.ANIME] in sent_prompt


@pytest.mark.asyncio
async def test_generate_image_api_error():
    """Test handling of API error response."""
    with patch("httpx.AsyncClient") as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.text = "Internal Server Error"
        
        mock_client_instance = AsyncMock()
        mock_client_instance.post.return_value = mock_response
        mock_client_instance.__aenter__.return_value = mock_client_instance
        mock_client_instance.__aexit__.return_value = None
        mock_client.return_value = mock_client_instance
        
        result = await generate_image("Test prompt")
        
        assert result["success"] == False
        assert "error" in result


@pytest.mark.asyncio
async def test_generate_image_timeout():
    """Test handling of timeout."""
    import httpx
    
    with patch("httpx.AsyncClient") as mock_client:
        mock_client_instance = AsyncMock()
        mock_client_instance.post.side_effect = httpx.TimeoutException("Timeout")
        mock_client_instance.__aenter__.return_value = mock_client_instance
        mock_client_instance.__aexit__.return_value = None
        mock_client.return_value = mock_client_instance
        
        result = await generate_image("Test prompt")
        
        assert result["success"] == False
        assert "timeout" in result["error"].lower()


@pytest.mark.asyncio
async def test_generate_image_no_url_in_response():
    """Test handling of response without image URL."""
    with patch("httpx.AsyncClient") as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"data": [{}]}  # No URL
        
        mock_client_instance = AsyncMock()
        mock_client_instance.post.return_value = mock_response
        mock_client_instance.__aenter__.return_value = mock_client_instance
        mock_client_instance.__aexit__.return_value = None
        mock_client.return_value = mock_client_instance
        
        result = await generate_image("Test prompt")
        
        assert result["success"] == False


def test_style_prompts_coverage():
    """Verify all style presets have prompts."""
    for style in StylePreset:
        assert style in STYLE_PROMPTS, f"Missing prompt for style: {style}"
