"""Tests for payment API."""
import pytest
import json
import hmac
import hashlib
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_checkout_invalid_sku(client: AsyncClient):
    """Test create checkout with invalid SKU."""
    response = await client.post(
        "/api/v1/payment/create-checkout",
        json={
            "product_sku": "invalid_sku",
            "device_id": "test-device",
            "success_url": "https://example.com/success"
        }
    )
    
    assert response.status_code == 400
    assert "Invalid product SKU" in response.json()["detail"]


@pytest.mark.asyncio
async def test_webhook_invalid_signature(client: AsyncClient):
    """Test webhook rejects invalid signature."""
    response = await client.post(
        "/api/v1/webhooks/creem",
        content=json.dumps({"eventType": "checkout.completed"}),
        headers={"creem-signature": "invalid-signature"}
    )
    
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_webhook_missing_signature(client: AsyncClient):
    """Test webhook rejects missing signature."""
    response = await client.post(
        "/api/v1/webhooks/creem",
        content=json.dumps({"eventType": "checkout.completed"})
    )
    
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_webhook_checkout_completed(client: AsyncClient):
    """Test webhook processes checkout.completed correctly."""
    from app.core.config import settings
    
    # Set test webhook secret
    original_secret = settings.CREEM_WEBHOOK_SECRET
    settings.CREEM_WEBHOOK_SECRET = "test_webhook_secret"
    
    try:
        event = {
            "eventType": "checkout.completed",
            "object": {
                "id": "checkout_123",
                "metadata": {
                    "product_sku": "starter_10",
                    "device_id": "webhook-test-device",
                    "generations": "10"
                },
                "customer": {
                    "email": "test@example.com"
                },
                "order": {
                    "amount": 299,
                    "currency": "usd"
                }
            }
        }
        
        payload = json.dumps(event).encode()
        signature = hmac.new(
            "test_webhook_secret".encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        response = await client.post(
            "/api/v1/webhooks/creem",
            content=payload,
            headers={"creem-signature": signature}
        )
        
        assert response.status_code == 200
        assert response.json()["received"] == True
        
        # Verify token was created
        token_response = await client.get(
            "/api/v1/tokens/by-device/webhook-test-device"
        )
        assert token_response.status_code == 200
        tokens = token_response.json()["tokens"]
        assert len(tokens) == 1
        assert tokens[0]["total_generations"] == 10
        assert tokens[0]["product_sku"] == "starter_10"
    finally:
        settings.CREEM_WEBHOOK_SECRET = original_secret


@pytest.mark.asyncio
async def test_create_checkout_success(client: AsyncClient):
    """Test create checkout with valid data."""
    from app.core.config import settings
    
    # Set test product ID
    original_ids = settings.CREEM_PRODUCT_IDS
    settings.CREEM_PRODUCT_IDS = {"starter_10": "prod_test_123"}
    settings.CREEM_API_KEY = "creem_test_key"
    
    try:
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_response = AsyncMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "checkout_url": "https://checkout.creem.io/test",
                "id": "session_123"
            }
            mock_post.return_value = mock_response
            
            response = await client.post(
                "/api/v1/payment/create-checkout",
                json={
                    "product_sku": "starter_10",
                    "device_id": "test-device",
                    "success_url": "https://example.com/success"
                }
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "checkout_url" in data
            assert "session_id" in data
    finally:
        settings.CREEM_PRODUCT_IDS = original_ids
