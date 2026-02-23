"""Tests for image generation API."""
import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_generate_image_free_trial(client: AsyncClient):
    """Test image generation with free trial."""
    with patch("app.api.v1.generate.generate_image", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {
            "success": True,
            "image_url": "https://example.com/image.png"
        }
        
        response = await client.post(
            "/api/v1/generate",
            json={
                "prompt": "A beautiful sunset over mountains",
                "device_id": "test-device-free-trial"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["is_free_trial"] == True
        assert data["image_url"] == "https://example.com/image.png"
        assert data["remaining_generations"] == 2


@pytest.mark.asyncio
async def test_generate_with_style(client: AsyncClient):
    """Test image generation with style preset."""
    with patch("app.api.v1.generate.generate_image", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {
            "success": True,
            "image_url": "https://example.com/anime.png"
        }
        
        response = await client.post(
            "/api/v1/generate",
            json={
                "prompt": "A warrior princess",
                "style": "anime",
                "device_id": "test-device-style"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True


@pytest.mark.asyncio
async def test_generate_empty_prompt(client: AsyncClient):
    """Test generation with empty prompt fails validation."""
    response = await client.post(
        "/api/v1/generate",
        json={
            "prompt": "",
            "device_id": "test-device"
        }
    )
    
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_generate_exhausted_free_trial(client: AsyncClient):
    """Test generation fails after free trial exhausted."""
    with patch("app.api.v1.generate.generate_image", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {
            "success": True,
            "image_url": "https://example.com/image.png"
        }
        
        device_id = "exhausted-device-test"
        
        # Use all 3 free generations
        for i in range(3):
            response = await client.post(
                "/api/v1/generate",
                json={
                    "prompt": f"Test prompt {i}",
                    "device_id": device_id
                }
            )
            assert response.status_code == 200
        
        # 4th should fail with payment required
        response = await client.post(
            "/api/v1/generate",
            json={
                "prompt": "One more please",
                "device_id": device_id
            }
        )
        
        assert response.status_code == 402
        data = response.json()
        assert "error" in data["detail"] or "payment_required" in str(data["detail"])


@pytest.mark.asyncio
async def test_generate_api_failure(client: AsyncClient):
    """Test generation handles API failure gracefully."""
    with patch("app.api.v1.generate.generate_image", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {
            "success": False,
            "error": "API temporarily unavailable"
        }
        
        response = await client.post(
            "/api/v1/generate",
            json={
                "prompt": "Test prompt",
                "device_id": "failure-test-device"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert "error" in data
        # Credits should be refunded on failure
        assert data["remaining_generations"] == 3


@pytest.mark.asyncio
async def test_402_error_detail_is_serializable(client: AsyncClient):
    """Verify 402 error's detail can be correctly serialized by frontend."""
    with patch("app.api.v1.generate.generate_image", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"success": True, "image_url": "http://x.com/i.png"}
        
        device_id = "exhausted-for-serialization-test"
        
        # Use all free trials
        for _ in range(3):
            await client.post("/api/v1/generate", json={"prompt": "x", "device_id": device_id})
        
        # Now should get 402
        response = await client.post(
            "/api/v1/generate",
            json={"prompt": "test", "device_id": device_id}
        )
        
        assert response.status_code == 402
        data = response.json()
        detail = data.get("detail")
        
        # detail should be a dict with 'error' field
        if isinstance(detail, dict):
            assert "error" in detail or "message" in detail, \
                f"Object detail must have 'error' or 'message' field: {detail}"
        else:
            assert isinstance(detail, str), f"detail must be string or object with error field: {detail}"
