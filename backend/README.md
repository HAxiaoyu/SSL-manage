# Backend

## Development Setup

1. Copy `.env.example` to `.env` and configure your settings
2. Create MySQL database: `CREATE DATABASE ssl_manage;`
3. Run migrations: `cd backend && alembic upgrade head`
4. Start the server: `uvicorn ssl_manage.main:app --reload`

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc