@echo off
echo Building debug APK to test...
set NODE_ENV=production

echo Cleaning android folder...
if exist android rmdir /s /q android

echo Running prebuild...
call npx expo prebuild --platform android

echo Building debug APK...
cd android
call gradlew.bat assembleDebug
echo ✅ Debug APK: android\app\build\outputs\apk\debug\app-debug.apk
cd ..
pause