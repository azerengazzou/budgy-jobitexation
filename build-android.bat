@echo off
echo Building Android APK locally...
echo Cleaning node_modules...
if exist node_modules rmdir /s /q node_modules
echo Installing dependencies...
call npm install
echo Running expo prebuild...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo Error during prebuild
    pause
    exit /b 1
)
echo Changing to android directory...
cd android
echo Building release APK...
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo Error during build
    cd ..
    pause
    exit /b 1
)
echo APK built successfully at: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause