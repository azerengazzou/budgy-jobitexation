@echo off
echo Quick Android build...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo Prebuild failed, trying clean prebuild...
    if exist android rmdir /s /q android
    call npx expo prebuild --platform android
)
cd android
call gradlew.bat assembleRelease
echo Build complete!
pause