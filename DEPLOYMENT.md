# RosterPro Deployment Guide

## System Requirements

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (optional)

## Environment Setup

### Server Environment Variables (.env)
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=rosterpro
DB_PASSWORD=your_password
DB_NAME=rosterpro
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

### Client Environment Variables (.env)
```env
VITE_API_URL=http://your-api-url:3000
```

## Deployment Options

### 1. Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Manual Deployment

#### Database Setup
```sql
-- Create database
CREATE DATABASE rosterpro;

-- Create user
CREATE USER rosterpro WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rosterpro TO rosterpro;
```

#### Server Deployment
```bash
# Install dependencies
cd server
npm install

# Build the application
npm run build

# Start the server
npm start
```

#### Client Deployment
```bash
# Install dependencies
cd client
npm install

# Build the application
npm run build

# Serve using nginx or similar
```

## Monitoring and Maintenance

### Health Checks

The server provides health check endpoints:
- `/health` - Basic health check
- `/health/db` - Database connection check
- `/health/redis` - Redis connection check

### Backup Procedures

1. Database Backup
```bash
pg_dump -U rosterpro rosterpro > backup.sql
```

2. Restore Database
```bash
psql -U rosterpro rosterpro < backup.sql
```

### Log Management

Logs are written to:
- Application logs: `/var/log/rosterpro/app.log`
- Error logs: `/var/log/rosterpro/error.log`

## Security Considerations

1. Always use HTTPS in production
2. Keep JWT_SECRET secure and unique
3. Regular security updates
4. Rate limiting is enabled by default
5. Input validation on all endpoints

## Scaling Considerations

1. Use load balancer for multiple server instances
2. Configure Redis for session management
3. Database indexing for common queries
4. Consider read replicas for database scaling

## Mobile App Deployment

### iOS
1. Configure certificates in Apple Developer Console
2. Build using Xcode
3. Submit to App Store

### Android
1. Configure signing keys
2. Build release APK
3. Submit to Play Store