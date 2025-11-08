@echo off
echo Checking build prerequisites...
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found.
    pause
    exit /b 1
)

echo Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java not found. Please install JDK 17.
    pause
    exit /b 1
)

echo Checking ANDROID_HOME...
if "%ANDROID_HOME%"=="" (
    echo ERROR: ANDROID_HOME not set. Please set Android SDK path.
    pause
    exit /b 1
) else (
    echo ANDROID_HOME: %ANDROID_HOME%
)

echo Checking Android SDK...
if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ERROR: Android SDK platform-tools not found.
    pause
    exit /b 1
)

echo Checking Expo CLI...
npx expo --version
if errorlevel 1 (
    echo ERROR: Expo CLI not accessible.
    pause
    exit /b 1
)

echo.
echo All prerequisites check passed!
echo You can now run build-android.bat to build the APK.
pause