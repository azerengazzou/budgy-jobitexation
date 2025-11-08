@echo off
set NODE_ENV=production
cd android
call gradlew.bat assembleRelease
echo ✅ APK: android\app\build\outputs\apk\release\app-release.apk
cd ..
pause