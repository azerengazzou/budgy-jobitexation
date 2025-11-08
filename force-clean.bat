@echo off
echo Force cleaning project...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
rmdir /s /q node_modules 2>nul
rmdir /s /q android 2>nul
rmdir /s /q .expo 2>nul
del package-lock.json 2>nul
echo Cleanup complete.
pause