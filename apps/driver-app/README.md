# Joshua Driver App

Mobile application for drivers in the Joshua ride-hailing platform.

## Features

- Phone + OTP authentication
- Driver profile with vehicle details
- Online/offline status toggle
- Real-time dispatch dashboard for ride requests
- Earnings tracking (daily/weekly/monthly)
- Map integration with location tracking
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
