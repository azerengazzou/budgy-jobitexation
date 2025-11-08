# Local Android Build Setup

## Prerequisites

1. **Install Android Studio:**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API 34)
   - Install Android SDK Build-Tools
   - Install Android Emulator (optional)

2. **Install Java Development Kit (JDK 17):**
   ```bash
   # Windows (using Chocolatey)
   choco install openjdk17

   # Or download from: https://adoptium.net/
   # Verify installation: java -version
   ```

3. **Set Environment Variables:**
   ```bash
   # Add to your system environment variables:
   ANDROID_HOME=C:\Users\[USERNAME]\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot

   # Add to PATH:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\build-tools\35.0.0
   %JAVA_HOME%\bin
   ```

## Setup Commands

1. **Check prerequisites:**
   ```bash
   setup-check.bat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Fix dependency versions:**
   ```bash
   npx expo install --fix
   ```

4. **Prebuild the project:**
   ```bash
   npx expo prebuild --platform android --clear
   ```

5. **Build debug APK:**
   ```bash
   cd android
   gradlew.bat assembleDebug
   ```

6. **Build release APK:**
   ```bash
   cd android
   gradlew.bat assembleRelease
   ```

7. **Install on device:**
   ```bash
   # Debug version
   adb install android\app\build\outputs\apk\debug\app-debug.apk

   # Release version  
   adb install android\app\build\outputs\apk\release\app-release.apk
   ```

## Quick Build Scripts

**Use the provided scripts:**
- `setup-check.bat` - Verify all prerequisites
- `build-android.bat` - Build release APK
- `rebuild-android.bat` - Clean rebuild from scratch

**Manual build commands:**
```batch
npm install
npx expo install --fix
npx expo prebuild --platform android --clear
cd android
gradlew.bat assembleRelease
```

## Troubleshooting

**Common issues:**
- Ensure ANDROID_HOME is set correctly
- Use JDK 17 (not newer versions like JDK 21)
- Run `npx expo doctor` to check setup
- Clear cache: `npx expo prebuild --clear`
- If Gradle fails: Delete android folder and run `rebuild-android.bat`
- Memory issues: Increase heap size in gradle.properties
- Permission errors: Run as administrator