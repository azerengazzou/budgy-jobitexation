@echo off
echo Simple production build...
set NODE_ENV=production

echo Installing dependencies...
call npm install --force
if errorlevel 1 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo Running prebuild...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo ❌ Prebuild failed!
    pause
    exit /b 1
)

echo Building APK...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause