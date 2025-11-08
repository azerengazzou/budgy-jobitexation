@echo off
echo Building APK with manual JS bundle...
set NODE_ENV=production

echo Step 1: Prebuild...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo ❌ Prebuild failed!
    pause
    exit /b 1
)

echo Step 2: Creating assets directory...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets

echo Step 3: Bundling JavaScript...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res
if errorlevel 1 (
    echo ❌ Bundle failed!
    pause
    exit /b 1
)

echo Step 4: Building APK...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
echo Bundle: android\app\src\main\assets\index.android.bundle
cd ..
pause