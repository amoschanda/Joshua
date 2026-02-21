# Joshua Rider App

Mobile application for riders in the Joshua ride-hailing platform.

## Features

- Phone + OTP authentication
- User profile setup
- Map view with nearby drivers
- Destination search and fare estimation
- Ride request and tracking
- Trip history
- Settings and profile management

## Quick Start

```bash
npm install
npm start
```

## Build APK

```bash
chmod +x build.sh
./build.sh
```

Or manually:
```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleDebug
```

## Configuration

Edit `app.json` for app settings and `theme.config.js` for colors.
