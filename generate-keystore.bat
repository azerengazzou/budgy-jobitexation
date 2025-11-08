@echo off
echo Generating release keystore...
cd android\app
keytool -genkey -v -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
echo Keystore generated at: android\app\release.keystore
echo Remember to update build.gradle with keystore details
pause