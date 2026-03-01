# FREEMAN MOBILE CLEANING - Product Requirements Document

## Original Problem Statement
Convert uploaded zip file to a cleaning app called "FREEMAN MOBILE CLEANING" with:
- 21 cleaning services
- Calendar and time slot booking
- Photo upload for items to be cleaned
- Yellow and black professional design
- No authentication or payments needed

## User Preferences
- **Design**: Yellow (#FFD700) and black professional theme
- **Features**: Time slot selection, photo upload capability
- **Auth**: No authentication (guest booking)
- **Payment**: No payment integration

## Architecture
- **Frontend**: React.js with Tailwind CSS, react-day-picker calendar
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Styling**: Custom yellow/black theme with Barlow Condensed + Manrope fonts

## Core Requirements (Static)
1. Display all 21 cleaning services
2. Calendar-based date selection
3. Time slot availability system
4. Photo upload for items
5. Customer details form
6. Booking confirmation

## What's Been Implemented (Jan 2026)

### Services (21 Total)
- Mobile CarWash, CarWash, LandScaping, Laundry
- Home Cleaning, Office Cleaning, Lawn Care, Garbage Collection
- Smart Home Repair, Environment Cleaning, Farm Work, Garden Work
- Toilet Cleaning, Yard Cleaning, Guest House Cleaning, Hotel Cleaning
- Building Cleaning, Carpet Cleaning, Sofa Cleaning, Mattress Cleaning
- Car Engine Cleaning

### Features Completed
- [x] Homepage with hero section and services grid
- [x] All Services page displaying 21 services
- [x] 4-step booking flow (Service → Date/Time → Photo → Details)
- [x] Calendar with date selection
- [x] 11 time slots (8AM-6PM)
- [x] Photo upload with preview
- [x] Contact form with validation
- [x] Booking confirmation page
- [x] Mobile responsive design
- [x] Yellow/black professional theme

### API Endpoints
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get single service
- `GET /api/time-slots?date=YYYY-MM-DD` - Get available slots
- `POST /api/upload-photo` - Upload item photo
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/{id}` - Get booking details

## User Personas
- **Residential Customers**: Home, carpet, sofa, mattress cleaning
- **Vehicle Owners**: Car wash, mobile car wash, engine cleaning
- **Commercial Clients**: Office, hotel, building cleaning
- **Property Managers**: Guest house, yard, garden maintenance

## Testing Status
- Backend: 100% pass rate
- Frontend: 100% pass rate
- All booking flows verified working

## Future/Backlog (P1/P2)
- P1: Admin dashboard for managing bookings
- P1: SMS/Email notifications for bookings
- P2: Pricing display for each service
- P2: Customer booking history
- P2: Service area/location filtering
- P2: Reviews and ratings system

## Next Tasks
1. Add pricing to services
2. Build admin dashboard
3. Implement email confirmations
