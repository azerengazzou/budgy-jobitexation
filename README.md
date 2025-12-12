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
│   │   ├── settings.tsx         # Settings screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── onboarding.tsx           # First-run setup
│   ├── goal-details.tsx         # Individual goal details
│   ├── addGoalModal.tsx         # Goal creation modal
│   ├── expense-category-details.tsx # Expense category details
│   ├── revenue-category-details.tsx # Revenue transaction history
│   ├── general.tsx              # General settings
│   ├── preferences.tsx          # User preferences
│   ├── profile.tsx              # User profile
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable UI components
│   ├── interfaces/              # TypeScript interfaces
│   │   ├── revenues.ts          # Revenue interfaces
│   │   ├── expenses.tsx         # Expense interfaces
│   │   ├── goals.tsx            # Goal interfaces (legacy)
│   │   ├── savings.ts           # Savings & goals interfaces
│   │   ├── categories.tsx       # Category interfaces
│   │   └── settings.tsx         # Settings interfaces
│   ├── style/                   # Component-specific styles
│   ├── AddSavingsModal.tsx      # Goal savings modal
│   ├── GoalCard.tsx             # Goal display component
│   ├── RevenueModal.tsx         # Revenue add/edit modal
│   ├── ExpenseModal.tsx         # Expense add/edit modal
│   ├── CreateGoalModal.tsx      # Goal creation modal
│   ├── NumericInput.tsx         # Currency input component
│   ├── KeyboardDismissWrapper.tsx # Keyboard handling
│   ├── CategoryIcons.tsx        # Category icon components
│   ├── CompletionCelebration.tsx # Goal completion animation
│   ├── DateFilter.tsx           # Date filtering component
│   ├── ExpenseCard.tsx          # Expense display card
│   ├── LoadingScreen.tsx        # Loading screen component
│   ├── ProgressRing.tsx         # Circular progress indicator
│   ├── RevenueCard.tsx          # Revenue display card
│   ├── SimulationModal.tsx      # Budget simulation modal
│   ├── SummaryCard.tsx          # Summary display card
│   └── SwipeToDelete.tsx        # Swipe gesture component
├── contexts/                     # React Context providers
│   ├── DataContext.tsx          # Global data state management
│   └── CurrencyContext.tsx      # Currency formatting
├── services/                     # Business logic & storage
│   ├── storage.ts               # Main storage service
│   ├── storage-base.ts          # Base storage operations
│   ├── storage-types.ts         # Storage type definitions
│   ├── revenue-storage.ts       # Revenue operations
│   ├── expense-storage.ts       # Expense operations
│   ├── savings-storage.ts       # Savings & goals operations
│   ├── category-storage.ts      # Category operations
│   ├── user-storage.ts          # User profile operations
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
- **React Native Modal** ^14.0.0-rc.1 - Modal components
- **React Native Gesture Handler** ~2.16.1 - Touch gestures
- **React Native Reanimated** ~3.10.1 - Animations
- **React Native Screens** ^3.31.1 - Native screen optimization

### Data & Storage
- **AsyncStorage** 1.23.1 - Local data persistence
- **React Native Picker** 2.7.5 - Dropdown selections
- **Date-fns** ^4.1.0 - Date manipulation utilities
- **React Native DateTimePicker** 8.0.1 - Date/time selection

### Internationalization
- **i18next** ^25.4.2 - Internationalization framework
- **React i18next** ^15.7.3 - React integration for i18n

### System Integration
- **Expo Notifications** ~0.28.19 - Push notifications
- **Expo Print** ~13.0.1 - PDF generation
- **Expo Sharing** ~12.0.1 - File sharing capabilities
- **Expo File System** ~17.0.1 - File operations
- **Expo Haptics** ~13.0.1 - Haptic feedback
- **Expo Device** ~6.0.2 - Device information
- **Expo Blur** ~13.0.3 - Blur effects
- **Expo Camera** ~15.0.16 - Camera functionality

## Data Models

### Revenue Interface
```typescript
interface Revenue {
  id: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance';
  remainingAmount: number;
  createdAt: string;
}
```

### Expense Interface
```typescript
interface Expense {
  id: string;
  name: string;
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
  completedAt?: string;
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

### User Profile Interface
```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
}
```

## Core Features

### Authentication & Profile
- **First-run onboarding** with personal information setup (first name, last name)
- **Local data storage** for complete offline functionality
- **User profile management** with editable profile information
- **Multi-language support** (English, French, Arabic) with RTL text support
- **Automatic app initialization** with backup detection and restore ( IN PROGRESS )

### Revenue Management
- **Multiple income sources** with individual tracking
- **Revenue types**: Salary, Freelance ( IMPROVEMENTS IN PROGRESS )
- **Individual transaction history** - each revenue entry stored separately
- **Automatic remaining amount calculation** after expenses
- **Monthly/Weekly carry-over** of unused funds with user preference ( IN PROGRESS )
- **Revenue source validation** for expense allocation
- **Quick amount suggestions** and common name templates
- **Revenue category details** with transaction history + filtering options

### Expense Tracking
- **Comprehensive expense logging** with customizable categories
- **Link expenses to specific revenue sources** with validation
- **Fixed categories**: Rent, Food, Transport + custom categories
- **Visual expense breakdown** with color-coded pie charts
- **Category-based spending analysis** with date filtering
- **Insufficient funds protection** with real-time validation
- **Swipe-to-delete** functionality for easy management
- **Expense category details** with filtering options

### Financial Goals & Savings
- **Goal creation** with target amounts, deadlines, and categories
- **Progress tracking** with visual indicators and completion animations
- **Goal categories**: Emergency Fund, Vacation, House/Property, Car/Vehicle, Education, General
- **Savings transactions** with revenue source deduction option
- **Goal completion detection** with celebration animations
- **Individual transaction history** per goal with detailed view
- **Quick savings amounts** for easy contributions
- **Goal status management** active, completed, paused, archived ( PAUSED AND ARCHIVED ARE IN PROGRESS )

### Dashboard & Analytics
- **Real-time financial overview** with animated metrics
- **Interactive pie charts** showing expense breakdowns by category
- **Total revenues, expenses, savings, and remaining balance** display
- **Quick access buttons** to manage categories and goals
- **Responsive design** for all screen sizes
- **Date-aware display** with localized formatting
- **Profile and settings access** from dashboard

### Smart Notifications
- **Daily expense logging reminders** (8:41 PM)
- **Weekly savings goal notifications** (every 7 days)
- **Hourly expense reminders** for active tracking
- **Budget limit alerts** with customizable thresholds
- **Notification permissions management**
- **Android notification channels** with proper configuration

### Settings & Preferences
- **Language selection** (English, French, Arabic)
- **Currency selection** (EUR, USD, TND) with proper formatting
- **Notification preferences** with toggle controls
- **Manual backup creation** with timestamp tracking
- **Data management** with complete data deletion option
- **User profile editing** from settings

### Data Management & Backup
- **Automatic backup system** with JSON file storage ( IMPROVEMENTS ARE IN PROGRESS )
- **Manual backup creation** with timestamped files ( IMPROVEMENTS ARE IN PROGRESS )
- **Backup detection and restore** on app initialization ( IMPROVEMENTS ARE IN PROGRESS )
- **Data import/export** functionality via file system ( IMPROVEMENTS ARE IN PROGRESS )
- **Monthly/Weekly carry-over processing** for unused revenue ( IMPROVEMENTS ARE IN PROGRESS )
- **Data integrity validation** and error handling
- **Complete data deletion** with confirmation

### UI/UX Features
- **Swipe gestures** for item deletion
- **Modal-based forms** with keyboard handling
- **Loading screens** with proper state management
- **Empty states** with helpful guidance
- **Progress indicators** (circular and linear)
- **Haptic feedback** for user interactions
- **Gradient backgrounds** with consistent theming
- **Icon-based navigation** with Lucide icons
- **Date filtering** with quick suggestions and custom ranges

## Architecture Details

### State Management
The app uses React Context for global state management:

- **DataContext**: Manages revenues, expenses, savings, goals, and savings transactions with refresh capabilities
- **CurrencyContext**: Handles currency formatting, symbol display, and currency updates

### Storage Architecture
Multi-layered storage system with specialized services:

- **StorageService**: Main service extending RevenueStorageService with backup integration
- **RevenueStorageService**: Revenue-specific operations with carry-over logic
- **ExpenseStorageService**: Expense and legacy goal operations
- **SavingsStorageService**: Savings transaction management and goal calculations
- **UserStorageService**: User profile, settings, and categories
- **CategoryStorageService**: Category management operations
- **BackupService**: Automated and manual backup/restore functionality

### Business Logic Implementation

#### Revenue Management
- Each revenue addition creates separate database entry with unique ID
- UI normalizes revenues by filtering duplicate salary entries (keeps latest)
- Remaining amount calculation: `remainingAmount = amount - totalLinkedExpenses`
- Monthly/Weekly carry-over resets remaining amounts based on user preference
- Revenue deletion cascades to related expenses with confirmation

#### Expense Management
- Revenue source validation ensures sufficient funds before expense creation
- Automatic deduction reduces revenue remaining amount when expense added
- Expense deletion returns amount to revenue source automatically
- Category filtering excludes 'salary' category from expense display
- Swipe-to-delete functionality with confirmation dialogs

#### Savings Goals
- Goal progress calculation: `progress = (currentAmount / targetAmount) * 100`
- Transaction tracking with individual deposits/withdrawals linked to revenue sources
- Automatic completion detection with status update and completion timestamp
- Revenue deduction when saving to goals (optional)
- Goal categories with predefined icons and colors
- Completion animations and celebrations

#### Dashboard Analytics
Real-time calculations with data normalization:
- Total Revenues: `sum(normalizedRevenues.amount)`
- Total Expenses: `sum(filteredExpenses.amount)`
- Remaining Balance: `totalRevenues - totalExpenses - totalSavings`
- Total Savings: `sum(goals.currentAmount)`
- Expense breakdown by category for pie chart visualization

### Navigation Structure
```
App Launch
├── Backup Detection & Restore (if available)
├── Onboarding (first time)
│   └── Profile Setup (firstName, lastName)
└── Main App (Tab Navigation)
    ├── Dashboard (Tab 1)
    │   ├── Profile Modal
    │   └── Settings Navigation
    ├── Revenues (Tab 2)
    │   └── Revenue Category Details Screen
    ├── Expenses (Tab 3)
    │   └── Expense Category Details Screen
    ├── Goals/Savings (Tab 4)
    │   ├── Add Goal Modal
    │   └── Goal Details Screen
    ├── Categories (Tab 5)
    └── Settings (Hidden Tab)
        ├── General Settings
        ├── Preferences
        └── Profile Management
```

## UI Components & Patterns

### Reusable Components
- **LinearGradient Backgrounds**: Consistent gradients (`#0A2540` to `#4A90E2` for main, `#6B7280` to `#4B5563` for settings)
- **Card Components**: Rounded cards with shadows, elevation, and proper spacing
- **Modal Components**: Bottom sheet modals with keyboard handling and backdrop dismiss
- **Button Patterns**: Primary, secondary, destructive, and quick-action button styles
- **Input Components**: Numeric inputs with currency formatting and validation
- **Progress Indicators**: Circular progress rings and linear progress bars with animations
- **Swipe Gestures**: Swipe-to-delete functionality with visual feedback
- **Loading States**: Dedicated loading screens with proper state management
- **Empty States**: Informative empty states with call-to-action buttons

### Specialized Components
- **GoalCard**: Progress visualization with category icons and completion states
- **RevenueCard**: Revenue display with usage indicators and quick actions
- **ExpenseCard**: Expense display with category information and date formatting
- **CategoryIcons**: Dynamic icon rendering based on category type
- **CompletionCelebration**: Animated celebration for goal completion
- **DateFilter**: Advanced date filtering with quick suggestions and custom ranges
- **NumericInput**: Currency-aware input with normalization and formatting
- **KeyboardDismissWrapper**: Automatic keyboard dismissal wrapper
- **RequiredFieldIndicator**: Visual indication for required form fields

### Design System
- **Color Palette**:
  - Primary: `#3B82F6` (Blue)
  - Success: `#10B981` (Green)
  - Warning: `#F59E0B` (Orange)
  - Error: `#EF4444` (Red)
  - Purple: `#8B5CF6` (Accent)
  - Gray Scale: `#6B7280`, `#9CA3AF`, `#D1D5DB`, `#F3F4F6`
  - Background Gradients: Multiple gradient combinations for different screens
- **Typography**: Consistent font sizes (12px-24px) with proper weights (400-700)
- **Spacing**: 8px grid system with standardized margins and padding
- **Border Radius**: 12px for cards, 8px for buttons, 20px for pills
- **Shadows**: Consistent shadow system with elevation levels
- **Icons**: Lucide React Native icons with consistent sizing (16px-64px)

## Screen Implementations

### Dashboard Screen (`app/(tabs)/index.tsx`)
- Real-time financial metrics with animated counters
- Interactive pie chart for expense breakdown by category
- Profile modal with editable user information
- Settings navigation and quick access buttons
- Date-aware header with localized formatting
- Remaining balance calculation with color-coded display
- Pull-to-refresh functionality

### Revenues Screen (`app/(tabs)/revenues.tsx`)
- Revenue list with usage indicators and available funds display
- Add/edit revenue modal with quick suggestions and amount presets
- Revenue type selection (Salary, Freelance) with icons
- Individual revenue tracking with transaction history
- Swipe-to-delete functionality with confirmation
- Empty state with helpful onboarding guidance

### Expenses Screen (`app/(tabs)/expenses.tsx`)
- Expense list with category breakdown and visual indicators
- Add/edit expense modal with revenue source validation
- Category-based filtering with date range selection
- Real-time insufficient funds checking
- Expense category details with transaction history
- Swipe-to-delete with automatic revenue restoration

### Goals/Savings Screen (`app/(tabs)/goals.tsx`)
- Savings goals list with progress indicators and completion states
- Goal creation modal with category selection and deadline picker
- Add savings modal with revenue source deduction option
- Goal completion animations and celebration effects
- Goal details screen with transaction history
- Quick contribution amounts and progress visualization

### Categories Screen (`app/(tabs)/categories.tsx`)
- Dual-tab interface for expense and revenue categories
- Search functionality with real-time filtering
- Add/edit category modals with validation
- Fixed vs custom category distinction
- Category usage statistics and management

### Settings Screen (`app/(tabs)/settings.tsx`)
- Language selection with immediate switching (EN, FR, AR)
- Currency selection with formatting updates (EUR, USD, TND)
- Notification preferences with system integration
- Manual backup creation with timestamp display
- Complete data deletion with confirmation flow
- Profile editing with validation

### Onboarding Screen (`app/onboarding.tsx`)
- Animated logo with bounce effects
- User profile setup (first name, last name)
- Required field validation with visual indicators
- Smooth transition to main app
- Localized content with proper RTL support

### Detail Screens
- **Revenue Category Details**: Transaction history with filtering
- **Expense Category Details**: Spending analysis with date ranges
- **Goal Details**: Progress tracking with transaction timeline
- **Profile Management**: Editable user information
- **Preferences**: Advanced settings and customization

## Data Flow

### Revenue Flow
1. User adds revenue → Form validation → Storage service saves → DataContext updates → UI refreshes → Auto-backup triggered
2. Revenue editing → Load existing data → Update with validation → Storage update → Context refresh
3. Revenue deletion → Confirmation dialog → Delete related expenses → Storage cleanup → Context update

### Expense Flow
1. User selects revenue source → Real-time funds validation → Creates expense → Deducts from revenue → Storage update → Context refresh
2. Expense deletion → Confirmation → Restore amount to revenue source → Storage update → UI refresh
3. Category filtering → Date range selection → Filter expenses → Update display

### Savings Flow
1. User creates goal → Category selection → Validation → Storage save → Context update → Auto-backup
2. Add savings → Amount validation → Optional revenue deduction → Create transaction → Update goal progress → Check completion
3. Goal completion → Status update → Completion timestamp → Celebration animation → Context refresh

### Settings Flow
1. Language change → i18n update → Storage save → UI re-render with new language
2. Currency change → Context update → Storage save → Amount formatting refresh
3. Notification toggle → System permissions → Service configuration → Storage save

### Backup Flow
1. Data changes → Auto-backup trigger → JSON serialization → File system write → Timestamp update
2. Manual backup → User action → Create backup file → Success notification → Update last backup time
3. App initialization → Scan for backups → User confirmation → Restore data → Context refresh

### Carry-over Flow
1. App launch → Check last processed period → Compare with current period → Reset revenue amounts → Update storage

## Notification System

### Implemented Notifications
- **Daily Expense Reminder**: 8:41 PM daily with calendar trigger
- **Weekly Savings Reminder**: Every 7 days with time interval trigger
- **Hourly Expense Reminder**: Every hour for active tracking
- **Budget Alerts**: Dynamic alerts when spending exceeds limits (via sendBudgetAlert method)

### Notification Configuration
- **Expo Notifications** with proper permission handling
- **Android notification channels** with custom importance and vibration patterns
- **Device detection** for proper notification support
- **Permission management** with graceful fallbacks
- **Notification scheduling** with automatic cancellation and rescheduling
- **Settings integration** with user-controlled enable/disable

### Notification Features
- **Localized content** (though notifications themselves use English)
- **Custom vibration patterns** for Android
- **LED light configuration** for supported devices
- **Notification importance levels** for proper system handling
- **Background notification handling** with proper app state management

## Internationalization Implementation

### Language Support
- **English (en)**: Default language with complete translations
- **French (fr)**: Full French localization with proper grammar
- **Arabic (ar)**: Complete Arabic translation with RTL text support

### Translation Coverage
- **Navigation elements**: Tab names, screen titles, button labels
- **Form components**: Input placeholders, validation messages, field labels
- **Business logic**: Revenue types, expense categories, goal categories
- **User feedback**: Success messages, error alerts, confirmation dialogs
- **Date formatting**: Localized date display with proper formatting
- **Currency formatting**: Region-appropriate currency symbols and formatting

### Implementation Features
- **Dynamic language switching** without app restart
- **Context-aware translations** for category names and business terms
- **RTL text support** for Arabic with proper text alignment
- **Fallback language** (English) for missing translations
- **Interpolation support** for dynamic content in translations
- **Settings integration** with persistent language preference

### Translation Structure
```typescript
resources = {
  en: { translation: { /* 200+ translation keys */ } },
  fr: { translation: { /* Complete French translations */ } },
  ar: { translation: { /* Complete Arabic translations */ } }
}
```

### Supported Languages
- **English (en)** - Default language with complete feature coverage
- **French (fr)** - Full French localization with proper grammar and formatting
- **Arabic (ar)** - Complete Arabic translation with RTL text support

### Supported Currencies
- **EUR (€)** - Euro (Default)
- **USD ($)** - US Dollar
- **TND (د.ت)** - Tunisian Dinar

## Storage Implementation

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
  SAVINGS_TRANSACTIONS: 'savings_transactions',
  REVENUE_CATEGORIES: 'revenue_categories',
  APP_INITIALIZED: 'app_initialized',
  LAST_BACKUP_TIME: 'last_backup_time'
} as const;
```

### Data Persistence Architecture
- **AsyncStorage**: Primary local storage for all app data
- **JSON serialization**: Consistent data format with validation
- **Automatic backup**: Triggered on data changes with file system storage
- **Backup directory**: `{DocumentDirectory}/budgy_backup/` with timestamped files
- **Data validation**: Comprehensive null/undefined checks and error handling
- **Carry-over tracking**: Period-based processing with timestamp storage

### Storage Services Hierarchy
```typescript
StorageService extends RevenueStorageService {
  // Main service with backup integration
  userStorage: UserStorageService
  expenseStorage: ExpenseStorageService
  savingsStorage: SavingsStorageService
}
```

### Backup System
- **Automatic backups**: Triggered on all data modifications
- **Manual backups**: User-initiated with success feedback
- **Backup scanning**: Automatic detection on app launch
- **Restore functionality**: User confirmation with data validation
- **Backup format**: JSON with metadata (timestamp, version)
- **File naming**: `finance_backup_YYYYMMDDHHMMSS.json`

## Business Rules

### Revenue Rules
- **Individual storage**: Each revenue entry stored separately with unique ID
- **Remaining amount calculation**: `remainingAmount = amount - totalLinkedExpenses`
- **Carry-over processing**: Monthly/Weekly reset based on user preference
- **Revenue normalization**: UI shows latest salary entry only (filters duplicates)
- **Deletion cascade**: Revenue deletion removes all related expenses with confirmation
- **Type validation**: Only 'salary' and 'freelance' types supported
- **Amount validation**: Must be positive number with currency normalization

### Expense Rules
- **Revenue source requirement**: Must be linked to existing revenue source
- **Funds validation**: Cannot exceed available revenue amount (real-time checking)
- **Automatic deduction**: Revenue remaining amount reduced on expense creation
- **Restoration on deletion**: Amount returned to revenue source when expense deleted
- **Category filtering**: 'salary' category excluded from expense display
- **Date tracking**: Creation date and transaction date stored separately

### Goal Rules
- **Progress calculation**: `progress = Math.min((currentAmount / targetAmount) * 100, 100)`
- **Automatic completion**: Status updated to 'completed' when target reached
- **Transaction tracking**: Individual deposits/withdrawals with revenue source linking
- **Revenue deduction**: Optional deduction from selected revenue source
- **Status management**: Active, completed, paused, archived states
- **Category validation**: Predefined categories with icons and colors
- **Completion timestamp**: Automatic timestamp on goal completion

### Data Integrity Rules
- **Amount normalization**: All amounts processed through normalizeAmount function
- **ID generation**: Timestamp-based unique ID generation
- **Null safety**: Comprehensive null/undefined checking throughout
- **Validation layers**: Form validation, business logic validation, storage validation
- **Error handling**: Graceful error handling with user feedback
- **Backup consistency**: Data changes trigger automatic backup creation

## Performance Optimizations

### Implemented Optimizations
- **FlatList Optimization**: Proper `keyExtractor` and `renderItem` callbacks with `showsVerticalScrollIndicator={false}`
- **useMemo & useCallback**: Memoization for expensive calculations and event handlers
- **Context Optimization**: Separate DataContext and CurrencyContext for targeted updates
- **AsyncStorage Batching**: Promise.all for parallel data operations
- **Component Memoization**: Strategic use of React.memo for expensive components
- **Data Normalization**: Client-side data processing to reduce re-renders
- **Loading States**: Proper loading state management to prevent UI blocking
- **Keyboard Handling**: KeyboardDismissWrapper for smooth keyboard interactions
- **Image Optimization**: Proper image sizing and caching
- **Animation Performance**: Native driver usage for smooth animations

### Memory Management
- **Cleanup Functions**: Proper cleanup in useEffect hooks
- **Event Listener Management**: Automatic cleanup of event listeners
- **Modal State Management**: Proper modal state cleanup on unmount
- **Data Filtering**: Client-side filtering to reduce data processing
- **Lazy Loading**: Components loaded only when needed

### Storage Optimizations
- **Batch Operations**: Multiple storage operations combined where possible
- **Data Validation**: Early validation to prevent unnecessary storage calls
- **Backup Throttling**: Automatic backup triggered efficiently
- **JSON Parsing Safety**: Safe JSON parsing with fallbacks
- **Storage Key Management**: Centralized storage key management

## Known Limitations

### Current Limitations
1. **Offline Only**: No cloud synchronization or remote backup
2. **Single Device**: Data not shared between devices
3. **Limited Export**: PDF export marked as "Coming Soon", no CSV/Excel
4. **No Recurring Transactions**: Manual entry required for all transactions
5. **Basic Analytics**: Limited to pie charts and basic totals
6. **Revenue Types**: Only Salary and Freelance supported (reduced from original 5 types)
7. **No Budget Limits**: No spending limit setting or enforcement
8. **Limited Date Ranges**: Basic date filtering without advanced analytics
9. **No Transaction Search**: No search functionality within transactions
10. **Single Currency**: No multi-currency support within single session

### Technical Limitations
- **Notification Localization**: Notifications display in English only
- **Large Data Sets**: No pagination for large transaction lists
- **Backup Size**: No compression for backup files
- **Image Support**: No receipt or document attachment support
- **Offline Maps**: No location-based expense tracking

### Potential Improvements
- **Cloud Integration**: Firebase or AWS backend for synchronization
- **Recurring Transactions**: Automated recurring revenue and expense entries
- **Advanced Analytics**: Trend analysis, spending predictions, budget insights
- **Multi-device Support**: Cross-platform data synchronization
- **Enhanced Export**: CSV, Excel, PDF with charts and detailed reports
- **Budget Planning**: Monthly budgets, spending limits, alerts
- **Receipt Management**: Camera integration for receipt capture
- **Investment Tracking**: Portfolio management and investment goals
- **Bill Reminders**: Due date tracking and payment reminders
- **Merchant Categories**: Automatic expense categorization
- **Data Visualization**: Advanced charts, graphs, and financial insights

## Development Setup

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

**Android Debug:**
```bash
npm run build:android:debug
```

## Configuration

### App Configuration (app.json)
- **Package**: com.budgy.app
- **Version**: 1.1.7
- **Orientation**: Portrait only
- **Permissions**: Internet, Notifications, Vibrate, System Alert Window, Boot Completed, Wake Lock, Post Notifications
- **Adaptive Icons**: Configured for Android with custom foreground and background
- **Bundle Identifier**: com.budgy.app (iOS)
- **Runtime Version**: 1.1.7
- **New Architecture**: Disabled

### Supported Platforms
- **Android**: Min SDK 23, Target SDK 35, Compile SDK 35
- **iOS**: Universal app with tablet support
- **Web**: Metro bundler with single output

## Acknowledgments

- **Expo Team** for the excellent development platform and comprehensive SDK
- **React Native Community** for robust libraries and community support
- **Lucide Icons** for the beautiful and consistent icon library
- **i18next** for powerful internationalization framework
- **React Native Chart Kit** for data visualization capabilities
- **AsyncStorage Community** for reliable local storage solution

---

**Budgy** - Take control of your budget and achieve your financial goals!

*A comprehensive personal finance management application built with modern React Native technologies, providing offline-first functionality with multi-language support and intuitive user experience.*