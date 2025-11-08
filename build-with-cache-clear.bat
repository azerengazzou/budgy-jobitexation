@echo off
echo Building with Metro cache clear...
set NODE_ENV=production

echo Clearing Metro cache...
call npx expo start --clear --no-dev --minify 2>nul
timeout /t 3 /nobreak >nul
taskkill /f /im node.exe 2>nul

echo Building APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleRelease --no-daemon
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause