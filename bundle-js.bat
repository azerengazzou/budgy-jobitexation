@echo off
echo Bundling JavaScript and assets...
echo.

echo Creating assets directory...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets

echo Bundling JavaScript...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res

if errorlevel 1 (
    echo ❌ JS bundling failed!
    pause
    exit /b 1
)

echo ✅ JavaScript bundle created successfully!
echo 📦 Bundle: android\app\src\main\assets\index.android.bundle
echo 🖼️ Assets: android\app\src\main\res\
pause