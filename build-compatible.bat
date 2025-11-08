@echo off
echo Building with compatible versions...
set NODE_ENV=production

echo Cleaning and reinstalling...
if exist android rmdir /s /q android
call npm install
call npx expo install --fix

echo Building APK...
call npx expo prebuild --platform android
cd android
call gradlew.bat assembleRelease
echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause