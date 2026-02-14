"""User schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base user schema."""
    
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""
    
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    
    email: EmailStr | None = None
    is_active: bool | None = None


class UserResponse(UserBase):
    """User response schema."""
    
    id: int
    is_active: bool
    created_at: datetime | None = None
    
    class Config:
        from_attributes = True