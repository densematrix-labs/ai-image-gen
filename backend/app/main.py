"""FastAPI application for AI Image Generator."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import generate, payment, tokens, metrics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Free AI Image Generator - Playground AI Alternative",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."}
    )


# Health check
@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": settings.APP_NAME}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }


# Include routers
app.include_router(generate.router, prefix="/api/v1", tags=["generation"])
app.include_router(payment.router, prefix="/api/v1", tags=["payment"])
app.include_router(tokens.router, prefix="/api/v1", tags=["tokens"])
app.include_router(metrics.router, tags=["metrics"])


# Bot detection middleware for SEO metrics
BOT_PATTERNS = ["Googlebot", "bingbot", "Baiduspider", "YandexBot", "DuckDuckBot"]


@app.middleware("http")
async def track_requests(request: Request, call_next):
    """Track requests for metrics."""
    ua = request.headers.get("user-agent", "")
    
    # Track crawler visits
    for bot in BOT_PATTERNS:
        if bot.lower() in ua.lower():
            metrics.crawler_visits.labels(
                tool=settings.TOOL_NAME,
                bot=bot
            ).inc()
            break
    
    response = await call_next(request)
    
    # Track HTTP requests
    metrics.http_requests.labels(
        tool=settings.TOOL_NAME,
        endpoint=request.url.path,
        method=request.method,
        status=response.status_code
    ).inc()
    
    return response
