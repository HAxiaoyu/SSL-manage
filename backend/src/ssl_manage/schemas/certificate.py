"""Certificate schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CertificateBase(BaseModel):
    """Base certificate schema."""
    
    common_name: str = Field(..., description="Common Name (CN) for the certificate")
    organization: Optional[str] = Field(None, description="Organization name")
    organizational_unit: Optional[str] = Field(None, description="Organizational Unit")
    locality: Optional[str] = Field(None, description="City/Locality")
    state_province: Optional[str] = Field(None, description="State or Province")
    country: Optional[str] = Field(None, description="Country code (2 letters)")
    email: Optional[EmailStr] = Field(None, description="Email address")


class CertificateCreate(CertificateBase):
    """Certificate creation schema."""
    
    valid_days: int = Field(365, description="Certificate validity in days", ge=1, le=3650)
    key_size: int = Field(2048, description="RSA key size", ge=2048, le=4096)
    
    # Subject Alternative Names
    san_dns: Optional[list[str]] = Field(None, description="DNS SANs")
    san_ip: Optional[list[str]] = Field(None, description="IP SANs")


class CertificateResponse(CertificateBase):
    """Certificate response schema."""
    
    id: int
    created_at: datetime
    expires_at: datetime
    serial_number: str
    fingerprint: str
    is_ca: bool = False
    status: str  # active, expired, revoked
    
    class Config:
        from_attributes = True


class CertificateListResponse(BaseModel):
    """Certificate list item schema."""
    
    id: int
    common_name: str
    organization: Optional[str]
    created_at: datetime
    expires_at: datetime
    status: str
    
    class Config:
        from_attributes = True


class CertificateDownload(BaseModel):
    """Certificate download response."""
    
    certificate_pem: str
    private_key_pem: str
    certificate_chain_pem: Optional[str] = None