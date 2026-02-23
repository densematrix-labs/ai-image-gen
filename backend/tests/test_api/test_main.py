"""Tests for main API endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    """Test health check endpoint."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """Test root endpoint."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "version" in data


@pytest.mark.asyncio
async def test_metrics_endpoint(client: AsyncClient):
    """Test Prometheus metrics endpoint."""
    response = await client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text
    assert "image_generations_total" in response.text


@pytest.mark.asyncio
async def test_get_products(client: AsyncClient):
    """Test get products endpoint."""
    response = await client.get("/api/v1/payment/products")
    assert response.status_code == 200
    products = response.json()
    assert isinstance(products, list)
    assert len(products) > 0
    for product in products:
        assert "sku" in product
        assert "price_cents" in product
        assert "generations" in product


@pytest.mark.asyncio
async def test_get_usage_new_device(client: AsyncClient):
    """Test get usage for new device."""
    response = await client.get("/api/v1/usage/test-device-123")
    assert response.status_code == 200
    data = response.json()
    assert data["free_remaining"] == 3
    assert data["paid_remaining"] == 0
    assert data["total_remaining"] == 3


@pytest.mark.asyncio
async def test_get_tokens_empty_device(client: AsyncClient):
    """Test get tokens for device with no tokens."""
    response = await client.get("/api/v1/tokens/by-device/new-device")
    assert response.status_code == 200
    data = response.json()
    assert data["tokens"] == []


@pytest.mark.asyncio
async def test_token_info_not_found(client: AsyncClient):
    """Test get token info for non-existent token."""
    response = await client.get("/api/v1/tokens/info/non-existent-token")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_validate_invalid_token(client: AsyncClient):
    """Test validate non-existent token."""
    response = await client.post("/api/v1/tokens/validate?token=fake-token")
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == False
