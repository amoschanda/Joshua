# Joshua - Complete Setup & Deployment Guide

## Project Overview

Joshua is a production-ready ride-hailing platform with:

- **Backend API**: Node.js + Express + PostgreSQL
- **Rider App**: React Native + Expo
- **Driver App**: React Native + Expo
- **Real-time**: WebSocket for live tracking
- **Payments**: Stripe integration
- **Maps**: Google Maps integration

## Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 12+
- Git
- Stripe account (test mode)
- Google Maps API key

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/amoschanda/Joshua.git
cd Joshua
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment

Copy environment files:

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/rider-app/.env.example apps/rider-app/.env
cp apps/driver-app/.env.example apps/driver-app/.env
```

Update each `.env` file with your configuration.

### 4. Start Backend

```bash
# Terminal 1: Backend API
pnpm dev:backend

# Server runs on http://localhost:3000
```

### 5. Start Mobile Apps

```bash
# Terminal 2: Rider App
pnpm dev:rider

# Terminal 3: Driver App
pnpm dev:driver
```

## Backend Setup Details

### Database Setup

PostgreSQL must be running. Create database:

```bash
createdb joshua
```

Or use Docker:

```bash
docker run -d \
  --name joshua-postgres \
  -e POSTGRES_DB=joshua \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### Environment Configuration

**apps/backend/.env**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=joshua

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps (get from Google Cloud Console)
GOOGLE_MAPS_API_KEY=your_key_here
```

### API Endpoints

All endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer YOUR_TOKEN
```

#### Authentication

```bash
# Register
POST /api/v1/auth/register
{
  "name": "John Rider",
  "email": "rider@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "rider"
}

# Login
POST /api/v1/auth/login
{
  "email": "rider@example.com",
  "password": "password123"
}

# Get Profile
GET /api/v1/auth/profile

# Update Profile
PUT /api/v1/auth/profile
{
  "name": "John Updated",
  "avatar_url": "https://..."
}
```

#### Rides

```bash
# Request Ride (Rider)
POST /api/v1/rides/request
{
  "pickupLat": 40.7128,
  "pickupLng": -74.0060,
  "dropoffLat": 40.7580,
  "dropoffLng": -73.9855,
  "pickupAddress": "123 Main St",
  "dropoffAddress": "456 Park Ave"
}

# Accept Ride (Driver)
POST /api/v1/rides/:rideId/accept

# Start Ride (Driver)
POST /api/v1/rides/:rideId/start

# Complete Ride (Driver)
POST /api/v1/rides/:rideId/complete
{
  "fare": 25.50,
  "distance": 5.2,
  "duration": 15
}

# Get Ride Details
GET /api/v1/rides/:rideId

# Get Ride History
GET /api/v1/rides?limit=10
```

#### Payments

```bash
# Create Payment Intent
POST /api/v1/payments/intent
{
  "rideId": "ride-uuid",
  "amount": 25.50
}

# Confirm Payment
POST /api/v1/payments/confirm
{
  "paymentIntentId": "pi_..."
}

# Get Payment History
GET /api/v1/payments/history

# Refund Payment
POST /api/v1/payments/refund
{
  "paymentIntentId": "pi_..."
}
```

## Testing Workflow

### 1. Register Users

Create a rider account:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Rider",
    "email": "rider@test.com",
    "phone": "+1111111111",
    "password": "password123",
    "role": "rider"
  }'
```

Create a driver account:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "email": "driver@test.com",
    "phone": "+2222222222",
    "password": "password123",
    "role": "driver"
  }'
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rider@test.com",
    "password": "password123"
  }'

# Response includes token
```

### 3. Request a Ride

```bash
curl -X POST http://localhost:3000/api/v1/rides/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pickupLat": 40.7128,
    "pickupLng": -74.0060,
    "dropoffLat": 40.7580,
    "dropoffLng": -73.9855,
    "pickupAddress": "Times Square, NYC",
    "dropoffAddress": "Central Park, NYC"
  }'
```

### 4. Driver Accepts Ride

```bash
curl -X POST http://localhost:3000/api/v1/rides/RIDE_ID/accept \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

### 5. Complete Ride and Process Payment

```bash
# Complete ride
curl -X POST http://localhost:3000/api/v1/rides/RIDE_ID/complete \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fare": 25.50,
    "distance": 5.2,
    "duration": 15
  }'

# Create payment intent
curl -X POST http://localhost:3000/api/v1/payments/intent \
  -H "Authorization: Bearer RIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rideId": "RIDE_ID",
    "amount": 25.50
  }'

# Confirm payment (use clientSecret with Stripe)
curl -X POST http://localhost:3000/api/v1/payments/confirm \
  -H "Authorization: Bearer RIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi_..."
  }'
```

## Production Deployment

### Option 1: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Set environment variables
railway variables set DB_HOST=...
railway variables set STRIPE_SECRET_KEY=...

# Deploy
railway up
```

### Option 2: Render

1. Connect GitHub repository to Render
2. Create PostgreSQL database
3. Set environment variables
4. Deploy from dashboard

### Option 3: AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update
sudo apt install nodejs postgresql postgresql-contrib

# Clone and setup
git clone https://github.com/amoschanda/Joshua.git
cd Joshua
pnpm install
pnpm build:backend

# Start with PM2
npm install -g pm2
pm2 start apps/backend/dist/index.js --name joshua-api
pm2 save
pm2 startup
```

### Environment Variables for Production

```env
# Database (use managed service like AWS RDS)
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=strong-password
DB_NAME=joshua

# Server
PORT=3000
NODE_ENV=production

# JWT (use strong secret)
JWT_SECRET=your-very-long-random-secret-key

# Stripe (use production keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Google Maps
GOOGLE_MAPS_API_KEY=your_production_key

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Monitoring & Maintenance

### Logs

```bash
# View PM2 logs
pm2 logs joshua-api

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Database Backups

```bash
# Backup
pg_dump joshua > backup.sql

# Restore
psql joshua < backup.sql
```

### Performance Monitoring

- Monitor database query performance
- Track API response times
- Monitor WebSocket connections
- Set up alerts for errors

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution: Start PostgreSQL
```bash
sudo service postgresql start
```

### Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
```

### JWT Token Issues

- Ensure JWT_SECRET is set
- Check token expiration (24 hours)
- Regenerate token by logging in again

### Stripe Integration Issues

- Verify test/production keys
- Check webhook configuration
- Test with Stripe test cards

## Support & Documentation

- Backend: `apps/backend/README.md`
- Rider App: `apps/rider-app/README.md`
- Driver App: `apps/driver-app/README.md`
- API Docs: See endpoint examples above

## License

MIT License - See LICENSE file

---

**Joshua Team** - Production-Ready Ride-Hailing Platform
