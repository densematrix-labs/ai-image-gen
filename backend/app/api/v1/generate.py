"""Image generation API endpoints."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models import GenerationToken, FreeTrialUsage, ImageGeneration
from app.schemas.generation import (
    GenerateImageRequest,
    GenerateImageResponse,
    UsageInfo,
)
from app.services.image_generator import generate_image

router = APIRouter()


async def get_or_create_free_trial(db: AsyncSession, device_id: str) -> FreeTrialUsage:
    """Get or create free trial usage record for device."""
    result = await db.execute(
        select(FreeTrialUsage).where(FreeTrialUsage.device_id == device_id)
    )
    usage = result.scalar_one_or_none()
    
    if not usage:
        usage = FreeTrialUsage(device_id=device_id, used_count=0)
        db.add(usage)
        await db.flush()
    
    return usage


async def get_paid_remaining(db: AsyncSession, device_id: str) -> int:
    """Get total remaining paid generations for device."""
    now = datetime.utcnow()
    result = await db.execute(
        select(GenerationToken).where(
            GenerationToken.device_id == device_id,
            GenerationToken.remaining_generations > 0,
            GenerationToken.expires_at > now,
        )
    )
    tokens = result.scalars().all()
    return sum(t.remaining_generations for t in tokens)


@router.get("/usage/{device_id}", response_model=UsageInfo)
async def get_usage(
    device_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get usage information for a device."""
    free_trial = await get_or_create_free_trial(db, device_id)
    await db.commit()
    
    free_remaining = max(0, settings.FREE_GENERATIONS_PER_DEVICE - free_trial.used_count)
    paid_remaining = await get_paid_remaining(db, device_id)
    
    return UsageInfo(
        free_remaining=free_remaining,
        paid_remaining=paid_remaining,
        total_remaining=free_remaining + paid_remaining,
    )


@router.post("/generate", response_model=GenerateImageResponse)
async def generate_image_endpoint(
    request: GenerateImageRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate an image from text prompt."""
    device_id = request.device_id
    
    # Check for paid token first
    paid_token = None
    if request.token:
        result = await db.execute(
            select(GenerationToken).where(GenerationToken.token == request.token)
        )
        paid_token = result.scalar_one_or_none()
        if paid_token and not paid_token.is_valid:
            paid_token = None
    
    # If no specific token, try to find any valid token for device
    if not paid_token:
        now = datetime.utcnow()
        result = await db.execute(
            select(GenerationToken).where(
                GenerationToken.device_id == device_id,
                GenerationToken.remaining_generations > 0,
                GenerationToken.expires_at > now,
            ).order_by(GenerationToken.expires_at)
        )
        paid_token = result.scalar_one_or_none()
    
    # Determine if using free trial or paid
    is_free_trial = False
    free_trial = None
    
    if paid_token:
        # Use paid token
        if not paid_token.use_generation():
            raise HTTPException(
                status_code=402,
                detail={"error": "Token exhausted or expired", "code": "payment_required"}
            )
        remaining = paid_token.remaining_generations
    else:
        # Check free trial
        free_trial = await get_or_create_free_trial(db, device_id)
        if free_trial.used_count >= settings.FREE_GENERATIONS_PER_DEVICE:
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "Free trial exhausted. Please purchase a pack to continue.",
                    "code": "payment_required"
                }
            )
        is_free_trial = True
        free_trial.used_count += 1
        free_trial.last_used_at = datetime.utcnow()
        remaining = settings.FREE_GENERATIONS_PER_DEVICE - free_trial.used_count
    
    # Record the generation attempt
    generation = ImageGeneration(
        device_id=device_id,
        token_id=paid_token.id if paid_token else None,
        prompt=request.prompt,
        model="dall-e-3",
        style=request.style.value if request.style else None,
        status="processing",
    )
    db.add(generation)
    await db.commit()
    
    # Generate the image
    result = await generate_image(request.prompt, request.style)
    
    # Update generation record
    if result["success"]:
        generation.status = "completed"
        generation.image_url = result["image_url"]
    else:
        generation.status = "failed"
        generation.error_message = result.get("error")
        # Refund the generation on failure
        if paid_token:
            paid_token.remaining_generations += 1
            remaining += 1
        elif free_trial:
            free_trial.used_count -= 1
            remaining += 1
    
    await db.commit()
    
    if not result["success"]:
        return GenerateImageResponse(
            success=False,
            error=result.get("error", "Image generation failed"),
            remaining_generations=remaining,
            is_free_trial=is_free_trial,
        )
    
    return GenerateImageResponse(
        success=True,
        image_url=result["image_url"],
        remaining_generations=remaining,
        is_free_trial=is_free_trial,
    )
