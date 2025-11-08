@echo off
echo Building debug APK...
if exist android rmdir /s /q android
call npx expo prebuild --platform android
cd android
call gradlew.bat assembleDebug
echo Debug APK built at: android\app\build\outputs\apk\debug\app-debug.apk
pause