@echo off
echo Fixing navigation dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
call npx expo install --fix
echo Building debug APK...
call debug-build.bat