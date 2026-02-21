# Joshua Backend API

Production-ready ride-hailing backend built with Node.js, Express, and PostgreSQL.

## Features

- ✅ User authentication (JWT)
- ✅ Role-based access control (rider, driver, admin)
- ✅ Ride request and matching
- ✅ Real-time location tracking (WebSocket)
- ✅ Payment processing (Stripe)
- ✅ Ride history and ratings
- ✅ Driver earnings tracking
- ✅ Admin dashboard

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Payments**: Stripe
- **Authentication**: JWT + bcrypt
- **Language**: TypeScript

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
```

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=joshua
PORT=3000
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_MAPS_API_KEY=your_key
```

### Database Setup

The database tables are automatically created on first run. Ensure PostgreSQL is running and the connection details are correct in `.env`.

### Development

```bash
# Start development server
pnpm dev

# The server will run on http://localhost:3000
```

### Building

```bash
# Build TypeScript
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Rides

- `POST /api/v1/rides/request` - Request a ride (rider)
- `POST /api/v1/rides/:rideId/accept` - Accept ride (driver)
- `POST /api/v1/rides/:rideId/start` - Start ride (driver)
- `POST /api/v1/rides/:rideId/complete` - Complete ride (driver)
- `GET /api/v1/rides/:rideId` - Get ride details
- `GET /api/v1/rides` - Get ride history

### Payments

- `POST /api/v1/payments/intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/history` - Get payment history
- `POST /api/v1/payments/refund` - Refund payment

## WebSocket Events

### Client → Server

- `driver_location` - Update driver location
- `ride_status` - Update ride status
- `ride_request` - Send ride request

### Server → Client

- `driver_location_update` - Broadcast driver location
- `ride_status_update` - Broadcast ride status change
- `new_ride_request` - Notify driver of new request

## Testing

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Rider",
    "email": "rider@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "rider"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rider@example.com",
    "password": "password123"
  }'
```

### Request Ride

```bash
curl -X POST http://localhost:3000/api/v1/rides/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pickupLat": 40.7128,
    "pickupLng": -74.0060,
    "dropoffLat": 40.7580,
    "dropoffLng": -73.9855,
    "pickupAddress": "123 Main St, NYC",
    "dropoffAddress": "456 Park Ave, NYC"
  }'
```

## Deployment

### Using Railway

```bash
# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

### Using Render

```bash
# Connect GitHub repository
# Set environment variables
# Deploy from Render dashboard
```

### Using AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install Node.js and PostgreSQL
sudo apt update
sudo apt install nodejs postgresql postgresql-contrib

# Clone repository and setup
git clone your-repo
cd joshua/apps/backend
pnpm install
pnpm build

# Start with PM2
npm install -g pm2
pm2 start dist/index.js --name joshua-api
```

## Security

- All passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
- HTTPS enforced in production
- CORS configured for allowed origins
- Rate limiting recommended for production
- SQL injection prevented with parameterized queries

## Performance

- Database indexes on frequently queried columns
- Connection pooling with pg
- WebSocket for real-time updates
- Stateless API design for horizontal scaling

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Ensure PostgreSQL is running:
```bash
sudo service postgresql start
```

### Port Already in Use

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### JWT Token Expired

Get a new token by logging in again.

## Support

For issues or questions, check the main Joshua repository documentation.

## License

MIT
