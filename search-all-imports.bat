@echo off
echo Searching for all remaining @ imports...
findstr /s /n "@/" *.tsx *.ts 2>nul
findstr /s /n "@/" app\*.tsx app\*.ts 2>nul
findstr /s /n "@/" app\**\*.tsx app\**\*.ts 2>nul
findstr /s /n "@/" contexts\*.tsx contexts\*.ts 2>nul
findstr /s /n "@/" components\*.tsx components\*.ts 2>nul
echo Search complete.
pause