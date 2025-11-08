@echo off
echo Fixing vulnerabilities with overrides...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
echo Checking vulnerabilities...
call npm audit
pause