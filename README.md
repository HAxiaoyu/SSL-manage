# SSL Certificate Management System

An enterprise-grade self-signed certificate management application built with modern web technologies.

## Project Overview

This project provides a complete solution for managing self-signed certificates in enterprise environments:

- **Generate** self-signed certificates with custom configurations
- **Store** certificates securely in a database
- **Manage** certificate lifecycles (creation, renewal, revocation)
- **Download** certificates in various formats
- **Monitor** certificate expiration dates

## Technology Stack

### Backend
- **Framework**: FastAPI (Python web framework)
- **Database**: MySQL 8.0 with SQLAlchemy 2.0 ORM
- **Security**: JWT authentication with python-jose
- **Cryptography**: cryptography 45.0.x library
- **Validation**: Pydantic v2
- **Dependency Management**: uv (Astral's Python package manager)

### Frontend
- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Library**: Ant Design Vue
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Project Structure

```
ssl-manage/
├── backend/
│   ├── src/ssl_manage/
│   │   ├── api/              # FastAPI routes and endpoints
│   │   ├── core/             # Configuration and security
│   │   ├── db/               # Database configuration
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic services
│   │   ├── utils/            # Utility functions
│   │   └── main.py           # Entry point
│   ├── tests/                # Backend tests
│   ├── alembic/              # Database migrations
│   ├── .env.example          # Environment variables template
│   ├── pyproject.toml        # Python project configuration
│   └── README.md             # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Vue components
│   │   ├── router/           # Vue Router configuration
│   │   ├── services/         # API client services
│   │   ├── stores/           # Pinia state stores
│   │   ├── types/            # TypeScript types
│   │   ├── views/            # Page components
│   │   ├── App.vue           # Root component
│   │   └── main.ts           # Entry point
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── README.md             # Frontend documentation
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy environment file and configure
cp .env.example .env

# Create MySQL database
mysql -u root -p
CREATE DATABASE ssl_manage;

# Install dependencies and run migrations
uv sync
uv run alembic upgrade head

# Start the development server
uv run ssl-manage
# or
uv run uvicorn ssl_manage.api.app:app --reload
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file if needed
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/token` - Login and get access token

### Users
- `POST /api/users/` - Register new user
- `GET /api/users/me` - Get current user profile

### Certificates
- `GET /api/certificates/` - List all certificates
- `POST /api/certificates/` - Create new certificate
- `GET /api/certificates/{id}` - Get certificate details
- `DELETE /api/certificates/{id}` - Delete certificate
- `GET /api/certificates/{id}/download` - Download certificate

## Development Workflow

### Making Changes

1. **Backend changes**: Make edits in `backend/src/ssl_manage/`
2. **Frontend changes**: Make edits in `frontend/src/`
3. **Database changes**: Use Alembic migrations

### Running Tests

```bash
# Backend tests
cd backend
uv run pytest

# Frontend tests
cd frontend
npm run test
```

### Code Quality

```bash
# Backend linting and formatting
cd backend
uv run black src
uv run ruff check src
uv run mypy src

# Frontend linting
cd frontend
npm run lint
```

## Git Workflow

All development is tracked through meaningful commits:

```bash
# Example workflow
git add .
git commit -m "feat: add certificate generation endpoint"
git push origin main
```

## Environment Variables

### Backend (.env)
```
APP_NAME=SSL Certificate Manager
DEBUG=True
HOST=127.0.0.1
PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ssl_manage
SECRET_KEY=your-secret-key
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

## Database

The project uses MySQL 8.0 as the primary database. Database schema is managed through Alembic migrations.

### Key Tables
- `users` - User accounts
- `certificates` - Generated certificates and their metadata

## Security Considerations

- JWT tokens for API authentication
- Password hashing with bcrypt
- CORS configuration for frontend
- Environment-based configuration
- SSL/TLS certificate validation

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "feat: description"`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please create an issue in the repository.