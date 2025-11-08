@echo off
echo Scanning and fixing all @ imports...

echo Fixing settings.tsx...
powershell -Command "(Get-Content 'app\(tabs)\settings.tsx') -replace '@/services/notifications', '../../services/notifications' -replace '@/services/storage', '../../services/storage' -replace '@/contexts/DataContext', '../../contexts/DataContext' | Set-Content 'app\(tabs)\settings.tsx'"

echo Fixing all other files...
powershell -Command "Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match '@/') { $content = $content -replace '@/services/storage', '../../services/storage' -replace '@/services/notifications', '../../services/notifications' -replace '@/contexts/DataContext', '../../contexts/DataContext'; Set-Content -Path $_.FullName -Value $content } }"

echo All @ imports fixed!
pause