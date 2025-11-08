@echo off
echo Building production APK...
echo.
echo Step 1: Cleaning previous builds...
if exist android rmdir /s /q android

echo Step 2: Running Expo prebuild...
call npx expo prebuild --platform android

echo Step 3: Building release APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ❌ Build failed! Check the error above.
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ Production APK built successfully!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo The APK includes:
echo ✅ Bundled JavaScript (no Metro needed)
echo ✅ All assets embedded
echo ✅ Hermes bytecode compilation
echo ✅ ProGuard/R8 optimization
echo.
echo You can now install and test offline:
echo adb install android\app\build\outputs\apk\release\app-release.apk
echo.
pause