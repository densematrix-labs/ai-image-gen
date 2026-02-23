"""Prometheus metrics endpoint."""
import os
from fastapi import APIRouter
from fastapi.responses import Response
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

router = APIRouter()

TOOL_NAME = os.getenv("TOOL_NAME", "ai-image-gen")

# HTTP Metrics
http_requests = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["tool", "endpoint", "method", "status"]
)

http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["tool", "endpoint", "method"]
)

# Payment Metrics
payment_success = Counter(
    "payment_success_total",
    "Successful payments",
    ["tool", "product_sku"]
)

payment_revenue_cents = Counter(
    "payment_revenue_cents_total",
    "Total revenue in cents",
    ["tool"]
)

# Usage Metrics
tokens_consumed = Counter(
    "tokens_consumed_total",
    "Total tokens consumed",
    ["tool"]
)

free_trial_used = Counter(
    "free_trial_used_total",
    "Free trial generations used",
    ["tool"]
)

# Core Function Metrics
image_generations = Counter(
    "image_generations_total",
    "Total image generations",
    ["tool", "style", "status"]
)

# SEO Metrics
page_views = Counter(
    "page_views_total",
    "Total page views",
    ["tool", "page"]
)

crawler_visits = Counter(
    "crawler_visits_total",
    "Crawler visits",
    ["tool", "bot"]
)

programmatic_pages = Gauge(
    "programmatic_pages_count",
    "Number of programmatic SEO pages",
    ["tool"]
)


@router.get("/metrics")
async def metrics():
    """Expose Prometheus metrics."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


# Helper functions to increment metrics
def record_generation(style: str = "none", success: bool = True):
    """Record an image generation."""
    status = "success" if success else "failed"
    image_generations.labels(tool=TOOL_NAME, style=style, status=status).inc()


def record_payment(product_sku: str, amount_cents: int):
    """Record a successful payment."""
    payment_success.labels(tool=TOOL_NAME, product_sku=product_sku).inc()
    payment_revenue_cents.labels(tool=TOOL_NAME).inc(amount_cents)


def record_token_consumed():
    """Record a token consumption."""
    tokens_consumed.labels(tool=TOOL_NAME).inc()


def record_free_trial():
    """Record a free trial usage."""
    free_trial_used.labels(tool=TOOL_NAME).inc()
