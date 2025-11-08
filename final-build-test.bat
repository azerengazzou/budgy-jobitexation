@echo off
echo Testing final build...
set NODE_ENV=production

echo Creating assets directory...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets

echo Bundling JavaScript...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res

if errorlevel 1 (
    echo ❌ Bundle failed - there are still import issues!
    pause
    exit /b 1
) else (
    echo ✅ Bundle successful - all imports fixed!
    echo Building APK...
    cd android
    call gradlew.bat assembleRelease
    echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
    cd ..
)
pause