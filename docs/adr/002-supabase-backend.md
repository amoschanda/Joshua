# ADR 002: Supabase Backend

## Status

Accepted

## Context

We need a backend that supports:
- Real-time location updates
- Authentication (phone OTP)
- PostgreSQL database
- Edge functions for business logic
- File storage for documents

## Decision

We will use Supabase as our backend platform.

### Components Used

1. **Supabase Auth** - Phone OTP authentication
2. **Supabase Database** - PostgreSQL with PostGIS for geospatial queries
3. **Supabase Realtime** - Real-time location and ride status updates
4. **Supabase Edge Functions** - Ride matching, payment webhooks, notifications
5. **Supabase Storage** - Driver documents, profile images

### Benefits

- Managed PostgreSQL with built-in auth
- Real-time subscriptions out of the box
- PostGIS support for location queries
- Edge functions for serverless compute
- Row Level Security for data protection

## Consequences

- Vendor lock-in to Supabase platform
- Learning curve for Row Level Security
- Edge function cold starts
