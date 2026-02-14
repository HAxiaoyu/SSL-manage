"""API routes aggregator."""

from fastapi import APIRouter

from ssl_manage.api.endpoints import auth, certificates, users

api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])