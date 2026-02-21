# Joshua - Onboarding Guide

## Prerequisites

- Node.js 18+
- pnpm 8+
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Supabase CLI

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/joshua.git
cd joshua
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
```

Required environment variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### 4. Supabase Setup

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Seed test data
supabase db seed
```

### 5. Start Development

```bash
# Start all apps
pnpm dev

# Or start specific app
cd apps/rider-app && pnpm start
cd apps/driver-app && pnpm start
```

## Project Structure

```
joshua/
├── apps/
│   ├── driver-app/     # Driver mobile app
│   └── rider-app/      # Rider mobile app
├── packages/
│   ├── ui/             # Shared UI components
│   ├── core/           # Business logic, API, state
│   └── hooks/          # Shared React hooks
└── supabase/           # Backend configuration
```

## Development Workflow

### Code Quality

```bash
# Lint code
pnpm lint

# Fix lint issues
pnpm lint:fix

# Type check
pnpm typecheck

# Format code
pnpm format
```

### Building

```bash
# Development build
cd apps/rider-app
eas build --profile development

# Preview build
eas build --profile preview

# Production build
eas build --profile production
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @joshua/core test
```

## Key Technologies

- **Expo SDK 55+** - React Native framework
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Supabase** - Backend (PostgreSQL, Auth, Realtime)
- **Stripe** - Payments

## Architecture

See `docs/diagrams/` for:
- C4 architecture diagrams
- Data flow diagrams
- Realtime channel documentation

## Troubleshooting

### Metro bundler issues

```bash
# Clear Metro cache
npx expo start --clear
```

### Dependency issues

```bash
# Clear all caches
pnpm clean
pnpm install
```

### Supabase issues

```bash
# Reset local database
supabase db reset
```

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [NativeWind Documentation](https://nativewind.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
