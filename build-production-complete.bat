@echo off
echo Building complete production APK...
echo.

echo Step 1: Setting environment...
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

echo Step 4: Bundling JavaScript and assets...
echo Creating assets directory...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets

echo Bundling JavaScript...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res
if errorlevel 1 (
    echo ❌ JS bundling failed!
    pause
    exit /b 1
)

echo Step 5: Building release APK...
cd android
call gradlew.bat clean assembleRelease
if errorlevel 1 (
    echo ❌ APK build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Production APK built with embedded JS bundle!
echo.
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
echo 📦 JS Bundle: android\app\src\main\assets\index.android.bundle
echo 🖼️ Assets: android\app\src\main\res\
echo.
echo The APK now includes:
echo ✅ Bundled JavaScript (offline capable)
echo ✅ All app assets embedded
echo ✅ Hermes bytecode compilation
echo ✅ Production optimizations
echo.
echo Install with: adb install android\app\build\outputs\apk\release\app-release.apk
echo.
cd ..
pause