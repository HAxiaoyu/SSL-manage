"""Main application entry point."""

import uvicorn

from ssl_manage.core.config import settings


def main() -> None:
    """Run the FastAPI application."""
    uvicorn.run(
        "ssl_manage.api.app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )


if __name__ == "__main__":
    main()