# Manual Setup Verification

Since automated verification isn't working, please manually verify these prerequisites:

## 1. Check Node.js
Open Command Prompt and run:
```
node --version
```
Should show version 18.0.0 or higher

## 2. Check npm
```
npm --version
```
Should show version 8.0.0 or higher

## 3. Check Java
```
java -version
```
Should show JDK 17 (not 21 or higher)

## 4. Check Android SDK
```
echo %ANDROID_HOME%
```
Should show path like: C:\Users\[USERNAME]\AppData\Local\Android\Sdk

## 5. Check ADB
```
adb version
```
Should show Android Debug Bridge version

## 6. Install Dependencies
In project directory:
```
npm install
```

## 7. Fix Version Conflicts
```
npx expo install --fix
```

## 8. Build Project
```
build-android.bat
```

If any step fails, install the missing prerequisite and try again.