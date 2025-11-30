# 💰 Budgy - Personal Finance Management App

A comprehensive React Native mobile application for managing personal finances, built with Expo and TypeScript. Budgy provides complete offline functionality for tracking income, expenses, savings goals, and financial analytics with multi-language support.

## Project Overview

**Version:** 1.1.7  
**Platform:** React Native with Expo  
**Languages:** TypeScript  
**Target:** iOS & Android  
**Architecture:** Offline-first with local storage  

## Project Structure

```
project/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Dashboard screen
│   │   ├── revenues.tsx         # Revenue management
│   │   ├── expenses.tsx         # Expense tracking
│   │   ├── goals.tsx            # Savings goals
│   │   ├── categories.tsx       # Category management
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── onboarding.tsx           # First-run setup
│   ├── goal-details.tsx         # Individual goal details
│   ├── add-goal.tsx             # Goal creation screen
│   ├── revenue-category-details.tsx # Revenue transaction history
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable UI components
│   ├── interfaces/              # TypeScript interfaces
│   ├── style/                   # Component-specific styles
│   ├── AddSavingsModal.tsx      # Goal savings modal
│   ├── GoalCard.tsx             # Goal display component
│   ├── RevenueModal.tsx         # Revenue add/edit modal
│   ├── NumericInput.tsx         # Currency input component
│   └── KeyboardDismissWrapper.tsx # Keyboard handling
├── contexts/                     # React Context providers
│   ├── DataContext.tsx          # Global data state management
│   └── CurrencyContext.tsx      # Currency formatting
├── services/                     # Business logic & storage
│   ├── storage.ts               # Main storage service
│   ├── revenue-storage.ts       # Revenue operations
│   ├── expense-storage.ts       # Expense operations
│   ├── savings-storage.ts       # Savings & goals operations
│   ├── backup-service.ts        # Data backup/restore
│   ├── notifications.ts         # Push notification service
│   └── i18n.ts                  # Internationalization
├── hooks/                        # Custom React hooks
│   ├── useFrameworkReady.ts     # App initialization
│   └── useGoalCompletionAnimation.ts # Goal animations
└── assets/                       # Static assets
    └── images/                   # App icons and images
```

## Tech Stack

### Core Framework
- **React Native** 0.74.5 - Mobile app framework
- **Expo** ~51.0.38 - Development platform and build tools
- **TypeScript** ~5.3.3 - Type safety and development experience
- **Expo Router** ~3.5.23 - File-based navigation system

### UI & Styling
- **Expo Linear Gradient** ~13.0.2 - Gradient backgrounds
- **React Native Chart Kit** ^6.12.0 - Data visualization (pie charts)
- **React Native SVG** 15.2.0 - Vector graphics
- **Lucide React Native** ^0.475.0 - Icon library
- **React Native Modal** ^14.0.0 - Modal components

### Data & Storage
- **AsyncStorage** 1.23.1 - Local data persistence
- **React Native Picker** 2.7.5 - Dropdown selections
- **Date-fns** ^4.1.0 - Date manipulation utilities

### Internationalization
- **i18next** ^25.4.2 - Internationalization framework
- **React i18next** ^15.7.3 - React integration for i18n

### System Integration
- **Expo Notifications** ~0.28.19 - Push notifications
- **Expo Print** ~13.0.1 - PDF generation
- **Expo Sharing** ~12.0.1 - File sharing capabilities
- **Expo File System** ~17.0.1 - File operations

## Data Models

### Revenue Interface
```typescript
interface Revenue {
  id: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
  remainingAmount: number;
  createdAt: string;
}
```

### Expense Interface
```typescript
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  revenueSourceId: string;
  date: string;
  createdAt: string;
}
```

### Goal Interface
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  deadline?: string | null;
  category?: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  isAutoSaveEnabled?: boolean;
  autoSaveRuleId?: string | null;
  metadata?: Record<string, any>;
}
```

### Savings Transaction Interface
```typescript
interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description?: string;
  date: string;
  revenueSourceId?: string;
}
```

## Core Features

###  Authentication & Profile
- **First-run onboarding** with personal information setup
- **Local data storage** for complete offline functionality
- **User profile management** with name and profession tracking
- **Multi-language support** (English, French, Arabic) with RTL text support

###  Revenue Management
- **Multiple income sources** with individual tracking
- **Revenue categories**: Salary, Freelance, Business, Investment, Other
- **Individual transaction history** - each revenue entry stored separately
- **Automatic remaining amount calculation** after expenses
- **Monthly carry-over** of unused funds
- **Revenue source validation** for expense allocation

###  Expense Tracking
- **Comprehensive expense logging** with customizable categories
- **Link expenses to specific revenue sources** with validation
- **Fixed categories**: Rent, Food, Transport + custom categories
- **Visual expense breakdown** with color-coded analytics
- **Category-based spending analysis**
- **Insufficient funds protection**

###  Financial Goals & Savings
- **Goal creation** with target amounts and deadlines
- **Progress tracking** with visual indicators and animations
- **Goal categories**: Emergency Fund, Vacation, House/Property, Car/Vehicle, Education
- **Savings transactions** with revenue source deduction
- **Goal completion detection** and status management
- **Individual transaction history** per goal

###  Dashboard & Analytics
- **Real-time financial overview** with animated metrics
- **Interactive pie charts** showing expense breakdowns
- **Monthly trend analysis** and balance tracking
- **Quick access buttons** to manage categories and goals
- **Responsive design** for all screen sizes

###  Smart Notifications
- **Daily expense logging reminders**
- **Weekly savings goal notifications**
- **Budget limit alerts** with customizable thresholds
- **Test notifications** for debugging

###  Export & Reporting
- **Monthly PDF report generation** (implemented via Expo Print)
- **Data export functionality** for external analysis
- **Professional report formatting** with charts and summaries

###  Internationalization
- **Multi-language support**: English, French, Arabic
- **Currency support**: EUR, USD, TND with proper formatting
- **RTL text support** for Arabic language
- **Dynamic language switching**

###  Data Management
- **Automatic backup system** with file-based storage
- **Data import/export** functionality
- **Monthly carry-over processing** for unused revenue
- **Data integrity validation** and error handling

##  Architecture Details

### State Management
The app uses React Context for global state management:

- **DataContext**: Manages revenues, expenses, savings, goals, and savings transactions
- **CurrencyContext**: Handles currency formatting and symbol display

### Storage Architecture
Multi-layered storage system with specialized services:

- **BaseStorageService**: Core AsyncStorage wrapper
- **RevenueStorageService**: Revenue-specific operations
- **ExpenseStorageService**: Expense and goal operations
- **SavingsStorageService**: Savings transaction management
- **UserStorageService**: User profile and settings

### Business Logic Implementation

#### Revenue Management
- Each revenue addition creates separate database entry
- UI groups revenues by name+type for clean presentation
- Remaining amount calculation: `remainingAmount = amount - totalExpenses`
- Monthly carry-over resets remaining amounts to full amount

#### Expense Management
- Revenue source validation ensures sufficient funds before expense creation
- Automatic deduction reduces revenue remaining amount when expense added
- Expense deletion returns amount to revenue source

#### Savings Goals
- Goal progress calculation: `progress = (currentAmount / targetAmount) * 100`
- Transaction tracking with individual deposits/withdrawals
- Automatic completion when target reached
- Revenue deduction when saving to goals

#### Dashboard Analytics
Real-time calculations:
- Total Revenues: `sum(revenues.amount)`
- Total Expenses: `sum(expenses.amount)`
- Remaining Balance: `totalRevenues - totalExpenses`
- Total Savings: `sum(goals.currentAmount)`

### Navigation Structure
```
App Launch
├── Onboarding (first time)
│   └── Profile Setup
└── Main App (Tab Navigation)
    ├── Dashboard (Tab 1)
    ├── Revenues (Tab 2)
    │   └── Revenue Details Screen
    ├── Expenses (Tab 3)
    ├── Goals (Tab 4)
    │   ├── Add Goal Screen
    │   └── Goal Details Screen
    └── Categories (Tab 5)
```

##  UI Components & Patterns

### Reusable Components
- **LinearGradient Backgrounds**: Consistent blue gradient (`#0A2540` to `#4A90E2`)
- **Card Components**: Rounded cards with shadows and proper spacing
- **Modal Components**: Consistent modal styling with backdrop blur
- **Button Patterns**: Primary, secondary, and destructive button styles
- **Input Components**: Numeric inputs with currency formatting
- **Progress Indicators**: Circular and linear progress bars

### Design System
- **Color Palette**:
  - Primary: `#3B82F6` (Blue)
  - Success: `#10B981` (Green)
  - Warning: `#F59E0B` (Orange)
  - Error: `#EF4444` (Red)
  - Background: `#0A2540` to `#4A90E2` (Gradient)
- **Typography**: Consistent font sizes and weights
- **Spacing**: 8px grid system for consistent spacing
- **Border Radius**: 12px for cards, 8px for buttons

##  Setup & Installation

### Prerequisites
- **Node.js** (version 18 or higher)
- **Expo CLI** installed globally
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd budgy
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Expo CLI globally**
```bash
npm install -g @expo/cli
```

4. **Start development server**
```bash
npm run dev
# or
expo start
```

5. **Run on device/simulator**
```bash
# Android
npm run android
# or
expo run:android

# iOS (macOS only)
npm run ios
# or
expo run:ios
```

### Building for Production

**Android APK:**
```bash
npm run build:android
```

**Android Bundle (Play Store):**
```bash
expo build:android --type app-bundle
```

##  Configuration

### App Configuration (app.json)
- **Package**: com.budgy.app
- **Version**: 1.1.7
- **Orientation**: Portrait only
- **Permissions**: Internet, Notifications, Vibrate, System Alert Window
- **Adaptive Icons**: Configured for Android
- **Bundle Identifier**: com.budgy.app (iOS)

### Supported Languages
- English (en) - Default
- French (fr)
- Arabic (ar) - with RTL support

### Supported Currencies
- EUR (€) - Default
- USD ($)
- TND (د.ت)

##  Screen Implementations

### Dashboard Screen (`app/(tabs)/index.tsx`)
- Real-time financial metrics display
- Pie chart for expense breakdown
- Profile and settings access
- Quick navigation to categories and goals

### Revenues Screen (`app/(tabs)/revenues.tsx`)
- Revenue list with usage indicators
- Add/edit revenue modal
- Revenue source management
- Individual revenue tracking

### Expenses Screen (`app/(tabs)/expenses.tsx`)
- Expense list with category breakdown
- Add/edit expense modal with revenue source selection
- Category-based filtering and analysis
- Date picker integration

### Goals Screen (`app/(tabs)/goals.tsx`)
- Savings goals list with progress indicators
- Goal creation and management
- Add savings modal with revenue source deduction
- Goal completion animations

### Categories Screen (`app/(tabs)/categories.tsx`)
- Expense and revenue category management
- Fixed vs custom category handling
- Search functionality
- Tab-based category organization

##  Data Flow

### Revenue Flow
1. User adds revenue → Storage service saves → DataContext updates → UI refreshes
2. Expense creation → Revenue validation → Amount deduction → Storage update

### Expense Flow
1. User selects revenue source → Validates available funds → Creates expense → Updates revenue remaining amount

### Savings Flow
1. User adds to goal → Creates savings transaction → Updates goal current amount → Optionally deducts from revenue

### Backup Flow
1. Data changes trigger auto-backup → Creates JSON backup file → Stores in device documents folder

##  Notification System

### Implemented Notifications
- **Daily Expense Reminder**: 8:41 PM daily
- **Weekly Savings Reminder**: Every 7 days
- **Hourly Expense Reminder**: Every hour
- **Budget Alerts**: When spending exceeds limits

### Notification Configuration
- Uses Expo Notifications with proper permissions
- Android notification channels configured
- Supports vibration and sound customization

##  Internationalization Implementation

### Language Files Structure
- Complete translations for all UI elements
- Context-aware translations (e.g., category names)
- RTL support for Arabic language
- Dynamic language switching without app restart

### Translation Keys
- Navigation elements
- Form labels and placeholders
- Error and success messages
- Business logic terms (revenue types, categories)

##  Storage Implementation

### AsyncStorage Keys
```typescript
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  REVENUES: 'revenues',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
  GOALS: 'goals',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
} as const;
```

### Data Persistence
- All data stored locally using AsyncStorage
- Automatic backup to device file system
- JSON-based backup format for portability
- Data validation and error handling

##  Business Rules

### Revenue Rules
- Each revenue entry is stored individually
- Remaining amount calculated as: `amount - totalLinkedExpenses`
- Monthly carry-over resets remaining amounts
- Revenue deletion cascades to related expenses

### Expense Rules
- Must be linked to a revenue source
- Cannot exceed available revenue amount
- Automatic revenue deduction on creation
- Revenue restoration on deletion

### Goal Rules
- Progress calculated as: `(currentAmount / targetAmount) * 100`
- Automatic completion when target reached
- Individual transaction tracking
- Optional revenue source deduction

## Performance Optimizations

### Implemented Optimizations
- **FlatList Optimization**: Proper `keyExtractor` and `renderItem` callbacks
- **useMemo & useCallback**: Memoization for expensive calculations
- **Context Optimization**: Separate contexts for different data types
- **AsyncStorage Batching**: Efficient data operations
- **Component Memoization**: Prevent unnecessary re-renders

##  Known Limitations

### Current Limitations
1. **Offline Only**: No cloud synchronization
2. **Single Device**: Data not shared between devices
3. **Limited Export**: PDF export only, no CSV/Excel
4. **No Recurring Transactions**: Manual entry required
5. **Basic Analytics**: Limited to pie charts and totals

### Potential Improvements
- Cloud backup and synchronization
- Recurring transaction support
- Advanced analytics and reporting
- Multi-device data sharing
- Enhanced export formats
- Budget planning features

## Acknowledgments

- **Expo Team** for the excellent development platform
- **React Native Community** for comprehensive libraries
- **Lucide Icons** for beautiful icon set
- **i18next** for internationalization support

---

**Budgy** - Take control of your budget and achieve your financial goals!