# Joshua Backend API - Complete Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Authentication Endpoints

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "rider"
}
```

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "rider"
  },
  "token": "jwt_token"
}
```

### Get Profile
```
GET /auth/profile
```

### Update Profile
```
PUT /auth/profile
```
**Body:**
```json
{
  "name": "Jane Doe",
  "avatar_url": "https://..."
}
```

---

## 🚗 Rides Endpoints

### Request Ride (Rider)
```
POST /rides/request
```
**Body:**
```json
{
  "pickupLat": 40.7128,
  "pickupLng": -74.0060,
  "dropoffLat": 40.7580,
  "dropoffLng": -73.9855,
  "pickupAddress": "Times Square, NYC",
  "dropoffAddress": "Central Park, NYC"
}
```

### Accept Ride (Driver)
```
POST /rides/:rideId/accept
```

### Start Ride (Driver)
```
POST /rides/:rideId/start
```

### Complete Ride (Driver)
```
POST /rides/:rideId/complete
```
**Body:**
```json
{
  "fare": 25.50,
  "distance": 5.2,
  "duration": 15
}
```

### Get Ride Details
```
GET /rides/:rideId
```

### Get Ride History
```
GET /rides?limit=10
```

---

## 💳 Payments Endpoints

### Create Payment Intent
```
POST /payments/intent
```
**Body:**
```json
{
  "rideId": "ride-uuid",
  "amount": 25.50
}
```

### Confirm Payment
```
POST /payments/confirm
```
**Body:**
```json
{
  "paymentIntentId": "pi_..."
}
```

### Get Payment History
```
GET /payments/history
```

### Refund Payment
```
POST /payments/refund
```
**Body:**
```json
{
  "paymentIntentId": "pi_..."
}
```

---

## 👨‍💼 Driver Endpoints

### Get Driver Stats
```
GET /drivers/stats
```

### Submit Documents
```
POST /drivers/documents
```
**Body:**
```json
{
  "licenseNumber": "DL123456",
  "licenseExpiry": "2025-12-31",
  "insuranceNumber": "INS123456",
  "insuranceExpiry": "2025-12-31",
  "backgroundCheckUrl": "https://..."
}
```

### Get Documents
```
GET /drivers/documents
```

### Get Incentives
```
GET /drivers/incentives
```

### Claim Incentive
```
POST /drivers/incentives/:incentiveId/claim
```

### Set Schedule
```
POST /drivers/schedule
```
**Body:**
```json
{
  "monday": { "start": "09:00", "end": "17:00" },
  "tuesday": { "start": "09:00", "end": "17:00" }
}
```

### Get Schedule
```
GET /drivers/schedule
```

### Calculate Surge Pricing
```
POST /drivers/surge-pricing
```
**Body:**
```json
{
  "pickupLat": 40.7128,
  "pickupLng": -74.0060
}
```

---

## 👤 Rider Endpoints

### Save Favorite Location
```
POST /riders/locations
```
**Body:**
```json
{
  "label": "Home",
  "lat": 40.7128,
  "lng": -74.0060,
  "address": "123 Main St, NYC"
}
```

### Get Saved Locations
```
GET /riders/locations
```

### Delete Saved Location
```
DELETE /riders/locations/:locationId
```

### Set Ride Preferences
```
POST /riders/preferences
```
**Body:**
```json
{
  "musicPreference": "pop",
  "temperaturePreference": "cool",
  "conversationLevel": "quiet",
  "petFriendly": false,
  "wheelchairAccessible": true
}
```

### Get Ride Preferences
```
GET /riders/preferences
```

### Add Emergency Contact
```
POST /riders/emergency-contacts
```
**Body:**
```json
{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "relationship": "sister"
}
```

### Get Emergency Contacts
```
GET /riders/emergency-contacts
```

### Delete Emergency Contact
```
DELETE /riders/emergency-contacts/:contactId
```

### Get Referral Code
```
GET /riders/referral
```

### Apply Referral Code
```
POST /riders/referral/apply
```
**Body:**
```json
{
  "referralCode": "REF123456"
}
```

### Get Rider Stats
```
GET /riders/stats
```

### Add Payment Method
```
POST /riders/payment-methods
```
**Body:**
```json
{
  "type": "card",
  "token": "stripe_token",
  "last4": "4242"
}
```

### Get Payment Methods
```
GET /riders/payment-methods
```

### Set Default Payment Method
```
POST /riders/payment-methods/:methodId/default
```

### Schedule Ride
```
POST /riders/schedule
```
**Body:**
```json
{
  "pickupLat": 40.7128,
  "pickupLng": -74.0060,
  "dropoffLat": 40.7580,
  "dropoffLng": -73.9855,
  "scheduledTime": "2025-02-22T10:00:00Z"
}
```

### Get Scheduled Rides
```
GET /riders/schedule
```

---

## 📊 Admin Endpoints

### Get Dashboard Stats
```
GET /admin/dashboard
```

### Get Revenue Analytics
```
GET /admin/analytics/revenue?startDate=2025-01-01&endDate=2025-02-21
```

### Get All Users
```
GET /admin/users?limit=50&offset=0
```

### Get User Details
```
GET /admin/users/:userId
```

### Disable User
```
POST /admin/users/:userId/disable
```
**Body:**
```json
{
  "reason": "Violation of terms"
}
```

### Enable User
```
POST /admin/users/:userId/enable
```

### Get Active Rides
```
GET /admin/rides/active
```

### Get Ride Details
```
GET /admin/rides/:rideId
```

### Cancel Ride
```
POST /admin/rides/:rideId/cancel
```
**Body:**
```json
{
  "reason": "Driver no-show"
}
```

### Get Support Tickets
```
GET /admin/support/tickets?status=open&limit=50
```

### Get Ticket Details
```
GET /admin/support/tickets/:ticketId
```

### Respond to Ticket
```
POST /admin/support/tickets/:ticketId/respond
```
**Body:**
```json
{
  "message": "We're looking into this issue..."
}
```

### Close Ticket
```
POST /admin/support/tickets/:ticketId/close
```
**Body:**
```json
{
  "resolution": "Issue resolved"
}
```

### Get Fraud Alerts
```
GET /admin/fraud/alerts
```

### Create Fraud Alert
```
POST /admin/fraud/alerts
```
**Body:**
```json
{
  "userId": "user-uuid",
  "alertType": "suspicious_activity",
  "description": "Multiple failed payments",
  "severity": "high"
}
```

### Resolve Fraud Alert
```
POST /admin/fraud/alerts/:alertId/resolve
```
**Body:**
```json
{
  "resolution": "User verified"
}
```

### Create Promotion
```
POST /admin/promotions
```
**Body:**
```json
{
  "code": "SAVE20",
  "discountPercent": 20,
  "maxUses": 1000,
  "expiresAt": "2025-03-31T23:59:59Z"
}
```

### Get Active Promotions
```
GET /admin/promotions
```

---

## 📈 Analytics Endpoints

### Get Daily Metrics
```
GET /analytics/daily?date=2025-02-21
```

### Get Weekly Metrics
```
GET /analytics/weekly?startDate=2025-02-01&endDate=2025-02-21
```

### Get Monthly Metrics
```
GET /analytics/monthly?year=2025&month=2
```

### Get Top Drivers
```
GET /analytics/drivers/top?limit=10
```

### Get Driver Performance
```
GET /analytics/drivers/:driverId/performance?days=30
```

### Get Top Riders
```
GET /analytics/riders/top?limit=10
```

### Get Popular Routes
```
GET /analytics/routes/popular?limit=10
```

### Get Hotspots
```
GET /analytics/hotspots
```

### Get Cancellation Analytics
```
GET /analytics/cancellations?days=30
```

### Get Payment Analytics
```
GET /analytics/payments?startDate=2025-01-01&endDate=2025-02-21
```

### Get User Retention
```
GET /analytics/retention?days=30
```

### Get Rating Distribution
```
GET /analytics/ratings?role=driver
```

### Export Metrics
```
GET /analytics/export?startDate=2025-01-01&endDate=2025-02-21
```

---

## 🔔 WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:3000');
```

### Driver Location Update
```javascript
socket.emit('driver_location', {
  driverId: 'driver-uuid',
  lat: 40.7128,
  lng: -74.0060
});

socket.on('driver_location_update', (data) => {
  console.log('Driver location:', data);
});
```

### Ride Status Update
```javascript
socket.emit('ride_status', {
  rideId: 'ride-uuid',
  status: 'in_progress'
});

socket.on('ride_status_update', (data) => {
  console.log('Ride status:', data);
});
```

### Ride Request Notification
```javascript
socket.emit('ride_request', {
  rideId: 'ride-uuid',
  driverId: 'driver-uuid'
});

socket.on('new_ride_request', (data) => {
  console.log('New ride request:', data);
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting (Recommended for Production)

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Security Best Practices

1. **JWT Expiration**: 24 hours
2. **Password Hashing**: bcrypt with 10 salt rounds
3. **HTTPS**: Required in production
4. **CORS**: Configured for allowed origins
5. **Input Validation**: All endpoints validate input
6. **SQL Injection Prevention**: Parameterized queries
7. **Rate Limiting**: Recommended implementation

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","phone":"+1111111111","password":"password123","role":"rider"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Request Ride
curl -X POST http://localhost:3000/api/v1/rides/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLat":40.7128,
    "pickupLng":-74.0060,
    "dropoffLat":40.7580,
    "dropoffLng":-73.9855,
    "pickupAddress":"Times Square",
    "dropoffAddress":"Central Park"
  }'
```

### Using Postman

1. Import the API collection
2. Set `{{baseUrl}}` to `http://localhost:3000/api/v1`
3. Set `{{token}}` from login response
4. Test each endpoint

---

## Support

For issues or questions, refer to the main Joshua repository documentation.
