@echo off
echo Fixing all @ imports in project...
for /r %%f in (*.tsx *.ts) do (
    powershell -Command "(Get-Content '%%f') -replace '@/services/storage', '../../../services/storage' -replace '@/contexts/DataContext', '../../../contexts/DataContext' | Set-Content '%%f'" 2>nul
)
echo All imports fixed!
pause