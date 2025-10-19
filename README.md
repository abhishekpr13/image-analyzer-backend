# Image PDF Analyzer Backend

A Node.js backend service for handling image and PDF file uploads, user authentication, and file management using PostgreSQL and TypeORM.

## Features

- User authentication (register/login) with JWT
- File upload handling for images and PDFs
- File management (list, download, delete)
- PostgreSQL database with TypeORM
- Dockerized PostgreSQL setup
- TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```

3. **Create environment file:**
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres123
   DB_NAME=image_analyzer_db
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=8000
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### File Management
- `POST /api/upload` - Upload a file (requires authentication)
- `GET /api/files` - Get all user files (requires authentication)
- `GET /api/files/:id` - Get specific file (requires authentication)
- `GET /api/files/download/:id` - Download file (requires authentication)
- `DELETE /api/files/:id` - Delete file (requires authentication)

## Database Schema

The application uses two main entities:
- **User**: Stores user information (id, name, email, password, createdAt)
- **File**: Stores file information (id, originalName, fileName, filePath, fileSize, mimeType, uploadDate, analysisResult, userId)

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run setup-db` - Complete database setup with automatic migrations

## Database Migrations

The application uses **automatic migration generation** based on entity changes. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed instructions.

### Quick Migration Commands
- `npm run setup-db` - Complete database setup (first time)
- `npm run migration:generate -- MigrationName` - Generate migration from entity changes
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run migration:show` - Show migration status

### How It Works
1. **Modify entities** in `src/entities/`
2. **Generate migration** automatically: `npm run migration:generate -- YourMigrationName`
3. **Review** the generated migration file
4. **Apply** the migration: `npm run migration:run`

## Docker

The PostgreSQL database runs in a Docker container. Use `docker-compose up -d` to start it and `docker-compose down` to stop it.

The database will automatically initialize with the required extensions and migrations table on first startup.
