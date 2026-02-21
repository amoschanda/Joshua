# Joshua Deployment Checklist

## Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] API endpoints tested
- [ ] Payment processing verified
- [ ] WebSocket connections tested

## Backend Deployment

### Local Testing

```bash
pnpm dev:backend
# Test all endpoints with curl or Postman
```

### Build

```bash
pnpm build:backend
```

### Deploy to Production

#### Railway
```bash
railway up
```

#### Render
```bash
# Connect GitHub and deploy from dashboard
```

#### AWS EC2
```bash
pm2 restart joshua-api
```

## Mobile App Deployment

### iOS

```bash
cd apps/driver-app
eas build --platform ios --profile production

cd apps/rider-app
eas build --platform ios --profile production
```

### Android

```bash
cd apps/driver-app
eas build --platform android --profile production

cd apps/rider-app
eas build --platform android --profile production
```

## Post-Deployment

- [ ] Verify API health: `GET /health`
- [ ] Test user registration
- [ ] Test ride request flow
- [ ] Test payment processing
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Verify WebSocket connections

## Rollback Plan

If issues occur:

```bash
# Rollback to previous version
pm2 restart joshua-api
# Or redeploy from git
git revert <commit-hash>
pnpm build:backend
pm2 restart joshua-api
```

## Monitoring

- Set up error tracking (Sentry)
- Monitor API response times
- Track database queries
- Monitor WebSocket connections
- Set up alerts for critical errors

