"""Payment schemas."""
from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    """Product information."""
    sku: str
    name: str
    price_cents: int
    generations: int
    discount_percent: Optional[int] = None


class CreateCheckoutRequest(BaseModel):
    """Request to create checkout session."""
    product_sku: str
    device_id: str
    success_url: str
    optional_email: Optional[str] = None


class CreateCheckoutResponse(BaseModel):
    """Response with checkout URL."""
    checkout_url: str
    session_id: str


class TokenInfo(BaseModel):
    """Token information."""
    token: str
    remaining_generations: int
    total_generations: int
    expires_at: str
    product_sku: str


class TokenListResponse(BaseModel):
    """List of tokens."""
    tokens: list[TokenInfo]


class ValidateResponse(BaseModel):
    """Token validation response."""
    valid: bool
