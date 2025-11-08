@echo off
echo Building production APK with fixed configuration...
echo.

echo Step 1: Cleaning dependencies and cache...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist android rmdir /s /q android

echo Step 2: Installing dependencies...
call npm install

echo Step 3: Running Expo prebuild...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo ❌ Prebuild failed!
    pause
    exit /b 1
)

echo Step 4: Building release APK...
cd android
call gradlew.bat clean assembleRelease
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Production APK built with fixed Metro config!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause