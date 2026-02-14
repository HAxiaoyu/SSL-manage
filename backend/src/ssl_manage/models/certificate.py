"""Certificate model."""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from ssl_manage.db.database import Base


class Certificate(Base):
    """Certificate database model."""
    
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Certificate details
    common_name = Column(String(255), nullable=False, index=True)
    organization = Column(String(255), nullable=True)
    organizational_unit = Column(String(255), nullable=True)
    locality = Column(String(255), nullable=True)
    state_province = Column(String(255), nullable=True)
    country = Column(String(2), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Certificate data
    certificate_pem = Column(Text, nullable=False)
    private_key_pem = Column(Text, nullable=False)
    public_key_pem = Column(Text, nullable=False)
    
    # Certificate metadata
    serial_number = Column(String(255), unique=True, nullable=False)
    fingerprint = Column(String(255), nullable=False)
    key_size = Column(Integer, default=2048)
    is_ca = Column(Boolean, default=False)
    
    # Validity
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)
    
    # Status: active, expired, revoked
    status = Column(String(20), default="active", index=True)
    
    # User relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", backref="certificates")