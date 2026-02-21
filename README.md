# Joshua - Ride Hailing Platform

A complete ride-hailing solution built with React Native, Expo, and Supabase.

## Project Structure

```
Joshua/
├── apps/
│   ├── driver-app/       # Driver mobile application
│   └── rider-app/        # Rider mobile application
├── packages/
│   ├── ui/              # Shared UI components
│   ├── core/            # Business logic & API
│   └── config-*/        # Shared configurations
└── supabase/            # Backend (PostgreSQL + Edge Functions)
```

## Tech Stack

- **Framework**: React Native with Expo SDK 55+
- **Navigation**: Expo Router (file-based routing)
- **State**: Zustand + TanStack Query
- **Styling**: NativeWind (Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Realtime, Auth, Edge Functions)
- **Payments**: Stripe
- **Maps**: Google Maps
- **Build**: Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Android Studio / Xcode
- Supabase CLI

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development
pnpm dev
```

### Running Apps

```bash
# Driver app
cd apps/driver-app
pnpm start

# Rider app
cd apps/rider-app
pnpm start
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter driver-app build
```

## Development

### Code Quality

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Format
pnpm format
```

### Testing

```bash
# Run all tests
pnpm test
```

## Deployment

### EAS Build

```bash
# Preview build
eas build --profile preview

# Production build
eas build --profile production
```

### Supabase

```bash
# Deploy migrations
supabase db push

# Deploy edge functions
supabase functions deploy
```

## License

MIT License

## Author

Joshua Team
