@echo off
echo Building production APK with complete cleanup...
echo.

echo Step 1: Complete cleanup...
set NODE_ENV=production
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist android rmdir /s /q android
if exist .expo rmdir /s /q .expo
call npx expo install --fix 2>nul

echo Step 2: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo Step 3: Fixing Expo dependencies...
call npx expo install --fix
if errorlevel 1 (
    echo ❌ expo install --fix failed!
    pause
    exit /b 1
)

echo Step 4: Running Expo prebuild...
call npx expo prebuild --platform android --clear
if errorlevel 1 (
    echo ❌ Prebuild failed!
    pause
    exit /b 1
)

echo Step 5: Building release APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Production APK built!
echo 📱 APK: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Install: adb install android\app\build\outputs\apk\release\app-release.apk
cd ..
pause