# Budgy - Personal Budget Management App

A comprehensive React Native mobile application for managing personal finances, built with Expo and TypeScript.

## Features

### 🔐 Authentication & Profile
- First-run onboarding with personal information setup
- Local data storage for complete offline functionality
- User profile management with profession and salary tracking

### 💰 Revenue Management
- Add, edit, and delete multiple income sources
- Track remaining amounts from each revenue source
- Automatic monthly carry-over of unused funds
- Support for different income types (salary, freelance, business, etc.)

### 📊 Expense Tracking
- Comprehensive expense logging with categories
- Link expenses to specific revenue sources
- Customizable expense categories
- Visual expense breakdown and analytics

### 🎯 Financial Goals
- Set financial targets with deadlines
- Track progress toward goals
- Contribute savings to specific goals
- Visual progress indicators

### 💾 Savings Management
- Blocked savings that can't be accidentally spent
- Manual savings adjustments
- Goal-based savings allocation

### 📈 Dashboard & Analytics
- Real-time financial overview
- Interactive charts showing expense breakdowns
- Monthly trend analysis
- Balance tracking across all accounts

### 🔔 Smart Notifications
- Daily expense logging reminders
- Weekly savings goal notifications
- Budget limit alerts
- Customizable notification preferences

### 📄 Export & Reporting
- Generate detailed monthly PDF reports
- Export financial data for external analysis
- Professional report formatting

### 🌍 Multi-language & Currency
- Support for English, French, and Arabic
- Currency support: EUR, USD, TND
- RTL text support for Arabic

### 🔄 Budget Simulation
- Test budget changes before implementing
- See impact of expense modifications
- What-if scenario planning

## Technology Stack

- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **Expo Router** for navigation
- **AsyncStorage** for local data persistence
- **Expo Linear Gradient** for beautiful UI
- **React Native Chart Kit** for data visualization
- **i18next** for internationalization
- **Expo Print** for PDF generation
- **Expo Notifications** for push notifications

## Setup Instructions

### Prerequisites

1. **Node.js** (version 18 or higher)
2. **Android Studio** with Android SDK
3. **Expo CLI** installed globally:
   ```bash
   npm install -g @expo/cli
   ```

### Installation
 **Start the development server:**
   ```bash
   npm run dev
   ```
   
### Building for Production

1. **Build APK for Android:**
   ```bash
   expo build:android
   ```

2. **Build AAB (recommended for Play Store):**
   ```bash
   expo build:android --type app-bundle
   ```

## App Architecture

### File Structure
```
app/
├── (tabs)/              # Tab-based navigation
│   ├── index.tsx        # Dashboard
│   ├── revenues.tsx     # Revenue management
│   ├── expenses.tsx     # Expense tracking
│   ├── goals.tsx        # Financial goals
│   └── settings.tsx     # App settings
├── onboarding.tsx       # First-run setup
├── index.tsx           # App entry point
└── _layout.tsx         # Root layout

services/
├── storage.ts          # AsyncStorage data layer
├── export.ts           # PDF export functionality
├── notifications.ts    # Push notification service
└── i18n.ts            # Internationalization

components/
└── SimulationModal.tsx # Budget simulation feature
```

### Data Flow
- **Local-first:** All data stored locally using AsyncStorage
- **Offline-capable:** Full functionality without internet connection
- **Monthly processing:** Automatic carry-over of unused revenue
- **Real-time updates:** Instant UI updates with optimistic rendering

## Features Guide

### Getting Started
1. Launch the app for the first time
2. Complete the onboarding with your personal information
3. Start adding revenue sources in the Revenues tab
4. Begin tracking expenses in the Expenses tab
5. Set up financial goals in the Goals tab

### Best Practices
- Set up all your income sources first
- Create custom expense categories for better tracking
- Set realistic financial goals with achievable deadlines
- Review your dashboard weekly to stay on track
- Use the simulation feature before making major budget changes

### Export Reports
- Navigate to Settings → Export Monthly Report
- PDF reports include all financial data for the current month
- Reports can be shared via email, cloud storage, or messaging apps

## Troubleshooting

### Common Issues

1. **App won't start on device:**
   - Ensure USB debugging is enabled
   - Check that device is properly connected: `adb devices`
   - Try restarting the Expo development server

2. **Charts not displaying:**
   - Ensure react-native-svg is properly linked
   - Try clearing the app cache

3. **Notifications not working:**
   - Check notification permissions in device settings
   - Ensure the app has permission to send notifications

4. **Export not working:**
   - Check device storage permissions
   - Ensure sufficient storage space for PDF generation

### Development Tips

- Use `expo start --clear` to clear cache if experiencing issues
- For debugging, use Flipper or React Native Debugger
- Test on multiple device sizes and orientations
- Verify all features work in offline mode

## Contributing

This app is designed to be production-ready with:
- Clean, maintainable code architecture
- Comprehensive error handling
- Responsive design for all screen sizes
- Accessibility features
- Performance optimizations

The codebase follows React Native best practices and is ready for production deployment to Google Play Store.