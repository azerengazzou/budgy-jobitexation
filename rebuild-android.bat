@echo off
echo Cleaning and rebuilding Android project...
echo Removing old android folder...
if exist android rmdir /s /q android
echo Clearing npm cache...
call npm cache clean --force
echo Installing dependencies...
call npm install
echo Running expo install --fix...
call npx expo install --fix
if errorlevel 1 (
    echo Error during dependency fix
    pause
    exit /b 1
)
echo Rebuilding android folder...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo Error during prebuild
    pause
    exit /b 1
)
echo Building release APK...
cd android
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