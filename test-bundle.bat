@echo off
echo Testing JS bundle with path alias fix...
echo.

echo Creating assets directory...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets

echo Bundling JavaScript with Metro config...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res --reset-cache

if errorlevel 1 (
    echo ❌ Bundle test failed!
    pause
    exit /b 1
)

echo ✅ Bundle test successful!
echo Path alias @/ is now working correctly.
pause