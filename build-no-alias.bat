@echo off
echo Building production APK without path aliases...
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

echo Step 4: Temporarily replacing @ imports with relative paths...
powershell -Command "(Get-Content 'app\(tabs)\categories.tsx') -replace '@/services/storage', '../../services/storage' | Set-Content 'app\(tabs)\categories.tsx'"
powershell -Command "(Get-Content 'app\(tabs)\expenses.tsx') -replace '@/services/storage', '../../services/storage' | Set-Content 'app\(tabs)\expenses.tsx'"
powershell -Command "(Get-Content 'app\(tabs)\expenses.tsx') -replace '@/contexts/DataContext', '../../contexts/DataContext' | Set-Content 'app\(tabs)\expenses.tsx'"

echo Step 5: Bundling JavaScript...
if not exist android\app\src\main\assets mkdir android\app\src\main\assets
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res --reset-cache
if errorlevel 1 (
    echo ❌ JS bundling failed!
    pause
    exit /b 1
)

echo Step 6: Building release APK...
cd android
call gradlew.bat clean assembleRelease
if errorlevel 1 (
    echo ❌ APK build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Production APK built!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause