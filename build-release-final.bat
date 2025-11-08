@echo off
echo Building production APK - Final attempt...
echo.

echo Step 1: Setting environment variables...
set NODE_ENV=production

echo Step 2: Cleaning previous builds...
if exist android rmdir /s /q android

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
echo ✅ SUCCESS! Production APK built!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Install with: adb install android\app\build\outputs\apk\release\app-release.apk
cd ..
pause