"""User management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ssl_manage.db.database import get_db
from ssl_manage.models.user import User
from ssl_manage.schemas.user import UserCreate, UserResponse
from ssl_manage.services.user import create_user, get_user_by_email

router = APIRouter()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    """Register a new user."""
    # Check if user already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )
    
    # Create new user
    user = create_user(db, user_data)
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    # TODO: Add current user dependency
):
    """Get current user information."""
    # Placeholder for now
    return {"id": 1, "email": "user@example.com", "is_active": True}