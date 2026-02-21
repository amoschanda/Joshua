#!/bin/bash

# Joshua Build Script for Ubuntu
# Usage: ./build.sh [driver|rider] [debug|release]

set -e

APP=${1:-rider}
BUILD_TYPE=${2:-debug}

echo "Building Joshua $APP app ($BUILD_TYPE)..."

# Navigate to app directory
cd "$(dirname "$0")/../apps/${APP}-app"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Generate native project
echo "Generating native Android project..."
npx expo prebuild --platform android --clean

# Build APK
echo "Building APK..."
cd android
chmod +x gradlew

if [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

echo ""
echo "Build complete!"
echo "APK location: $(pwd)/$APK_PATH"
