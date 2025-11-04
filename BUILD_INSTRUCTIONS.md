# Google Play Store Build Instructions

## Prerequisites

1. **Install EAS CLI globally:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Verify project setup:**
   ```bash
   eas whoami
   ```

## Step 1: Configure EAS Build

1. **Initialize EAS in your project:**
   ```bash
   eas build:configure
   ```

2. **Generate Android keystore automatically:**
   ```bash
   eas credentials
   ```
   - Select "Android" → "production" → "Keystore" → "Generate new keystore"
   - EAS will automatically generate and manage your keystore

## Step 2: Build for Testing (APK)

**Build preview APK for local testing:**
```bash
eas build --platform android --profile preview
```

This creates an APK file you can install directly on Android devices for testing.

## Step 3: Build for Production (AAB)

**Build production AAB for Google Play Store:**
```bash
eas build --platform android --profile production
```

This creates an Android App Bundle (.aab) optimized for Play Store distribution.

## Step 4: Download and Test APK

1. **Download the APK from EAS dashboard:**
   - Visit: https://expo.dev/accounts/[your-username]/projects/budgy/builds
   - Download the preview APK

2. **Install on Android device:**
   ```bash
   adb install path/to/your-app.apk
   ```

3. **Test all features:**
   - ✅ App launches correctly
   - ✅ All screens navigate properly
   - ✅ Data persistence works
   - ✅ Notifications function
   - ✅ Language switching works
   - ✅ Categories management
   - ✅ Revenue/expense tracking

## Step 5: Optimize App Size

**Before building production, optimize:**

1. **Remove unused dependencies:**
   ```bash
   npm audit
   npx expo install --fix
   ```

2. **Enable Hermes (already configured):**
   - Hermes is enabled by default in Expo SDK 54+

3. **Optimize images:**
   - Ensure icon.png is 1024x1024px
   - Use WebP format for large images if needed

## Step 6: Google Play Console Setup

### 6.1 Create Google Play Developer Account
1. Visit: https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete account verification

### 6.2 Create New App
1. **Create app:**
   - App name: "Budgy - Personal Budget Manager"
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free

2. **App details:**
   - Short description: "Take control of your personal finances with Budgy - track expenses, manage income, and achieve your savings goals."
   - Full description: 
   ```
   Budgy is a comprehensive personal budget management app designed to help you take control of your finances. With an intuitive interface and powerful features, managing your money has never been easier.

   KEY FEATURES:
   • 💰 Revenue Management - Track multiple income sources
   • 📊 Expense Tracking - Categorize and monitor spending
   • 🎯 Savings Goals - Set and achieve financial targets
   • 📈 Visual Analytics - Charts and insights
   • 🌍 Multi-language Support - English, French, Arabic
   • 💾 Offline Storage - Your data stays private
   • 🔔 Smart Reminders - Never miss tracking expenses

   PRIVACY & SECURITY:
   All your financial data is stored locally on your device. No cloud sync, no data sharing - complete privacy guaranteed.

   LANGUAGES:
   Full support for English, French, and Arabic with RTL text support.

   Start your journey to financial freedom with Budgy today!
   ```

### 6.3 Store Listing Assets

**Required screenshots (create these):**
- Phone screenshots: 2-8 images (1080x1920px or 1080x2340px)
- 7-inch tablet: 1-8 images (1200x1920px)
- 10-inch tablet: 1-8 images (1920x1200px)

**Feature graphic:**
- Size: 1024x500px
- Showcase app features

**App icon:**
- Size: 512x512px (high-res version of your icon)

### 6.4 Content Rating
1. Complete content rating questionnaire
2. Select appropriate age rating
3. For Budgy: likely "Everyone" or "Teen"

### 6.5 App Content
1. **Privacy Policy:** Required for apps that handle personal data
2. **Target audience:** Select appropriate age groups
3. **Content declarations:** Complete all required sections

### 6.6 Release Management

1. **Upload AAB:**
   - Go to "Release" → "Production"
   - Upload your .aab file from EAS build
   - Complete release notes

2. **Release notes example:**
   ```
   🎉 Welcome to Budgy v1.0.0!

   ✨ Features:
   • Complete budget management system
   • Multi-language support (EN/FR/AR)
   • Offline data storage
   • Visual expense analytics
   • Smart notifications

   📱 Perfect for:
   • Personal finance tracking
   • Expense categorization
   • Savings goal management
   • Budget planning

   Your financial data stays completely private on your device!
   ```

## Step 7: Testing Before Release

### Internal Testing
1. **Create internal testing track:**
   - Add test users (up to 100)
   - Upload AAB to internal testing
   - Test all functionality

### Closed Testing (Optional)
1. **Create closed testing track:**
   - Add external testers
   - Gather feedback
   - Fix any issues

## Step 8: Production Release

1. **Final checks:**
   - ✅ All store listing complete
   - ✅ Screenshots uploaded
   - ✅ Content rating approved
   - ✅ Privacy policy linked
   - ✅ AAB uploaded and processed

2. **Submit for review:**
   - Click "Send for review"
   - Review typically takes 1-3 days
   - Address any policy violations if flagged

3. **Go live:**
   - Once approved, release to production
   - Monitor crash reports and user feedback

## Commands Summary

```bash
# Setup
npm install -g @expo/eas-cli
eas login
eas build:configure

# Generate keystore
eas credentials

# Build for testing
eas build --platform android --profile preview

# Build for production
eas build --platform android --profile production

# Check build status
eas build:list

# Download builds
eas build:download [build-id]
```

## Version Updates

**For future updates:**

1. **Update version in app.json:**
   ```json
   {
     "version": "1.0.1",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. **Build new version:**
   ```bash
   eas build --platform android --profile production
   ```

3. **Upload to Play Console:**
   - Create new release
   - Upload new AAB
   - Update release notes

## Troubleshooting

**Common issues:**

1. **Build fails:** Check expo doctor
   ```bash
   npx expo doctor
   ```

2. **Keystore issues:** Regenerate credentials
   ```bash
   eas credentials --clear-cache
   ```

3. **App size too large:** Enable app bundle optimization in Play Console

4. **Upload rejected:** Check Play Console policy compliance

## Success Metrics

After launch, monitor:
- Install rates
- Crash-free sessions
- User ratings and reviews
- Performance metrics in Play Console

Your app is now ready for Google Play Store! 🚀