# RosterPro Installation Guide

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- Docker and Docker Compose (optional)

## Installation Options

### 1. Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Chrisfoz/rosterpro.git
cd rosterpro
```

2. Create environment files:
```bash
# Create .env file in server directory
cp server/.env.example server/.env

# Create .env file in client directory
cp client/.env.example client/.env
```

3. Start the application:
```bash
docker-compose up -d
```

The application will be available at:
- Web interface: http://localhost:5173
- API: http://localhost:3000

### 2. Manual Installation

#### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

#### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the Expo development server:
```bash
npm start
```

## Configuration

### Database Configuration

Update the following variables in `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=rosterpro
```

### Redis Configuration

Update the Redis connection URL in `server/.env`:

```env
REDIS_URL=redis://localhost:6379
```

### API Configuration

Update the API URL in `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

For the mobile app, update in `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Development

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Mobile tests
cd mobile
npm test
```

### Database Migrations

```bash
cd server

# Create a new migration
npm run migrate:create

# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback
```

### Seeding Data

```bash
cd server
npm run seed
```

## Deployment

### Production Build

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build

# Mobile
cd mobile
eas build
```

### Environment Variables

Make sure to set the following environment variables in production:

```env
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://your-domain.com
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Redis Connection Issues**
   - Verify Redis is running
   - Check Redis connection URL

3. **Build Issues**
   - Clear node_modules and reinstall
   - Update Node.js version
   - Clear build caches

### Getting Help

- Check the [GitHub Issues](https://github.com/Chrisfoz/rosterpro/issues)
- Join our [Discord Community](#)
- Contact support at support@rosterpro.com