# Build Troubleshooting Guide

## Common Issues and Solutions

### 1. Node.js Not Found
**Error**: `'node' is not recognized`
**Solution**: Install Node.js 18+ from https://nodejs.org

### 2. Java Not Found
**Error**: `'java' is not recognized`
**Solution**: Install JDK 17 from https://adoptium.net

### 3. ANDROID_HOME Not Set
**Error**: Build fails with Android SDK errors
**Solution**: 
- Install Android Studio
- Set ANDROID_HOME environment variable
- Add to PATH: %ANDROID_HOME%\platform-tools

### 4. Gradle Build Fails
**Error**: Gradle wrapper not found
**Solution**: Run `npx expo prebuild --platform android --clear`

### 5. Memory Issues
**Error**: OutOfMemoryError during build
**Solution**: Increase heap size in gradle.properties (already configured)

### 6. Dependency Conflicts
**Error**: Version mismatch warnings
**Solution**: Run `npx expo install --fix`

### 7. Build Scripts Don't Work
**Error**: Permission denied or command not found
**Solution**: Run Command Prompt as Administrator

## Manual Build Steps
If automated scripts fail:
```
npm install
npx expo install --fix
npx expo prebuild --platform android --clear
cd android
gradlew.bat assembleRelease
```