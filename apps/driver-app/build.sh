#!/bin/bash

# Joshua Driver App - Build Script
# This script builds the APK for Android

echo "========================================"
echo "Joshua Driver App - Build Script"
echo "========================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf android ios .expo

# Generate native code
echo "Generating native Android project..."
npx expo prebuild --platform android --clean

# Build APK
echo "Building Debug APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "========================================"
    echo "BUILD SUCCESSFUL!"
    echo "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    echo "========================================"
    
    # Copy APK to root
    cp app/build/outputs/apk/debug/app-debug.apk ../joshua-driver.apk
    echo "APK copied to: joshua-driver.apk"
else
    echo "BUILD FAILED!"
    exit 1
fi
