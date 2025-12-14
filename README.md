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
- **Budgy Insights** - Smart financial advisor with personalized recommendations
- **Responsive design** for all screen sizes
- **Date-aware display** with localized formatting
- **Profile and settings access** from dashboard

### Budgy Insights - Smart Financial Advisor
- **Intelligent Analysis**: Analyzes revenues, expenses, savings, and goals to detect patterns and risks
- **Priority-Based Recommendations**: Critical, high, medium, and low priority advice sorted by urgency
- **Actionable Insights**: Each recommendation includes specific actions with direct navigation
- **Collapsible Interface**: Toggle visibility for a personalized, clutter-free experience
- **Real-Time Updates**: Advice dynamically updates as financial situation changes
- **Data-Driven**: Recommendations based on actual spending patterns and financial health metrics
- **Minimal Design**: Clean, professional presentation with color-coded priority indicators
- **Multi-Language Support**: Fully translated advice in English, French, and Arabic

#### Insight Categories
1. **Critical Alerts** (Red)
   - Budget deficit detection
   - Spending exceeds 85% of income
   - Immediate action required

2. **High Priority** (Orange)
   - Category consuming 40%+ of budget
   - Savings rate below 10%
   - Important financial adjustments needed

3. **Medium Priority** (Blue)
   - Goals below 30% progress
   - No income sources tracked
   - No savings goals set
   - Recommended improvements

4. **Low Priority** (Green)
   - Savings optimization tips (10-20% rate)
   - Excellent financial health celebration
   - Positive reinforcement

#### Financial Advisor Engine
**Location**: `services/financial-advisor.ts`

**Analysis Capabilities**:
- Total revenues, expenses, and savings calculations
- Expense rate: `(totalExpenses / totalRevenues) * 100`
- Savings rate: `(totalSavings / totalRevenues) * 100`
- Category-level spending analysis
- Goal progress tracking
- Balance and liquidity monitoring
- Pattern detection across all financial areas

**Advice Generation Logic**:
```typescript
class FinancialAdvisor {
  // Analyzes user data
  constructor(revenues, expenses, goals)
  
  // Generates prioritized advice
  generateAdvice(): FinancialAdvice[]
  
  // Returns top N recommendations
  getTopAdvice(limit = 3): FinancialAdvice[]
}
```

**Advice Structure**:
```typescript
interface FinancialAdvice {
  id: string;                    // Unique identifier
  category: AdviceCategory;      // spending | income | savings | goals | health
  priority: AdvicePriority;      // critical | high | medium | low
  title: string;                 // Localized title key
  message: string;               // Localized message key
  action?: string;               // Optional action button text
  actionRoute?: string;          // Navigation route for action
  icon: string;                  // Icon type identifier
}
```

#### UI Implementation
**Location**: `app/(tabs)/index.tsx`

**Features**:
- Collapsible header with chevron indicator
- Info icon in light blue circle
- One-line description: "Data-driven recommendations based on your financial activity"
- Color-coded left borders for priority visualization
- Clean card layout with icon, title, message, and action button
- Arrow icon for action navigation
- Minimal shadows and subtle styling

**User Controls**:
- Tap header to expand/collapse
- Shows top 3 most important recommendations
- Maintains toggle state during session
- Updates automatically on data changes

#### Integration Points
- **Dashboard**: Displayed between metrics and charts
- **Data Context**: Recalculates on every data change
- **Navigation**: Action buttons link to relevant screens
- **Translations**: Full i18n support with context-aware messages

#### Example Recommendations
1. **Deficit Detected**: "Your spending exceeds income. Immediate action required to restore balance." → Create Budget
2. **High Category Spending**: "One category consumes 40%+ of your budget. Review for savings opportunities." → Review Category
3. **Low Savings Rate**: "Saving less than 10%. Experts recommend 20% for financial security." → Increase Savings
4. **Goals Behind Schedule**: "Some goals are below 30% progress. Increase contributions to stay on track." → Contribute
5. **Excellent Health**: "You're spending <60% and saving 20%+. Outstanding money management!" → (Celebration)

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
- **Automatic backup system** with JSON file storage and real-time triggers
- **Manual backup creation** with timestamped files and user feedback
- **Backup detection and restore** on app initialization with user confirmation
- **Data import/export** functionality via file system with validation
- **Monthly/Weekly carry-over processing** for unused revenue with period tracking
- **Data integrity validation** and comprehensive error handling
- **Complete data deletion** with confirmation and app restart

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
- **Budgy Insights** - Collapsible smart financial advisor section
- Interactive pie charts with 4 chart types (expenses, comparison, savings, health)
- Chart switcher tabs for different financial views
- Context-aware advice cards for each chart type
- Profile modal with editable user information
- Settings navigation
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

### Backup Data Flow

#### Automatic Backup Flow
```
User Action (Add/Edit/Delete)
    ↓
Storage Service Method
    ↓
Data Validation & Processing
    ↓
AsyncStorage Update
    ↓
backupService.autoBackup() Trigger
    ↓
Data Collection (Promise.all)
    ↓
JSON Serialization
    ↓
File System Write
    ↓
Timestamp Update
    ↓
Status Notification
```

#### Manual Backup Flow
```
User Taps Backup Button
    ↓
backupService.createBackup()
    ↓
Status: 'pending'
    ↓
Data Collection from AsyncStorage
    ↓
Backup Data Structure Creation
    ↓
File Creation with Timestamp
    ↓
Status: 'success' | 'failed'
    ↓
User Feedback (Alert)
    ↓
UI Status Update
```

#### App Initialization Flow
```
App Launch
    ↓
Check 'app_initialized' Flag
    ↓
If First Launch:
    ↓
backupService.scanForBackups()
    ↓
If Backup Found:
    ↓
User Confirmation Dialog
    ↓
If User Confirms:
    ↓
backupService.restoreFromBackup()
    ↓
Data Validation & Restoration
    ↓
Context Refresh
    ↓
Set 'app_initialized' = true
```

#### Backup Restoration Flow
```
Restore Request
    ↓
File Path Validation
    ↓
Read Backup File
    ↓
Content Validation
    ↓
JSON Parsing
    ↓
Data Structure Validation
    ↓
AsyncStorage Batch Update
    ↓
Success/Failure Response
    ↓
UI Feedback
    ↓
Data Context Refresh
```

#### Local Backup Flow
```
User Taps Local Backup
    ↓
backupService.createLocalBackup()
    ↓
Collect Backup Data
    ↓
Determine Platform Storage Path
    ↓
Create External Directory
    ↓
Write JSON File to External Storage
    ↓
Success/Failure Response
    ↓
User Notification
```

#### Share Backup Flow
```
User Taps Share Backup
    ↓
backupService.shareBackup()
    ↓
Create Internal Backup File
    ↓
Check Sharing Availability
    ↓
Open System Share Dialog
    ↓
User Selects App/Service
    ↓
File Shared Successfully
```

#### Data Backup Flow
```
User Taps Generate Backup
    ↓
backupService.generateQRBackup()
    ↓
Collect Essential Data Only
    ↓
Compress Data for Portability
    ↓
Generate Backup String
    ↓
Display Data + Copy Option
    ↓
User Copies/Shares Data
```

#### Data Restore Flow
```
User Taps Restore
    ↓
User Pastes Backup Data
    ↓
backupService.restoreFromQR()
    ↓
Validate Backup Data
    ↓
Restore to AsyncStorage
    ↓
Refresh Data Context
    ↓
Success Notification
```

### Carry-over Flow
```
App Launch
    ↓
storageService.processCarryOver()
    ↓
Get User Carry-over Preference (monthly/weekly)
    ↓
Calculate Current Period
    ↓
Check Last Processed Period
    ↓
If New Period Detected:
    ↓
Load All Revenues
    ↓
Reset remainingAmount = amount
    ↓
Update Storage
    ↓
Update Last Processed Timestamp
    ↓
Trigger Auto-backup
```

## Comprehensive Backup System

Budgy implements a robust, multi-layered backup system that ensures data safety and provides seamless data recovery capabilities. The system operates on three levels: automatic backups, manual backups, and app initialization restore.

### System Architecture

The backup system is built around the `BackupService` class which manages all backup operations independently of the main storage services to avoid circular dependencies.

#### Core Components

**BackupService (`services/backup-service.ts`)**
- Singleton service managing all backup operations
- Status tracking with real-time notifications
- File system operations for backup storage
- Data validation and error handling

**Storage Integration**
- Main `StorageService` extends backup functionality
- Automatic backup triggers on all data modifications
- Backup status integration in settings UI

**App Initialization**
- Backup scanning on first launch
- User confirmation for data restoration
- Graceful handling of backup failures

### Automatic Backup System

#### Trigger Points
Automatic backups are triggered on every data modification operation:

```typescript
// Revenue operations
await storageService.addRevenue(revenue);
// → Triggers: backupService.autoBackup()

// Expense operations  
await storageService.addExpense(expense);
// → Triggers: backupService.autoBackup()

// Goal and savings operations
await storageService.addGoal(goal);
// → Triggers: backupService.autoBackup()

// Settings changes
await storageService.saveSettings(settings);
// → Triggers: backupService.autoBackup()
```

#### Data Collection Process
1. **Direct AsyncStorage Access**: Bypasses storage services to avoid circular dependencies
2. **Parallel Data Retrieval**: Uses `Promise.all()` for efficient data collection
3. **Safe JSON Parsing**: Comprehensive null/undefined validation with fallbacks
4. **Data Normalization**: Ensures consistent data structure across backups

#### Backup Creation Flow
```typescript
// 1. Set status to pending
backupStatus.status = 'pending';

// 2. Collect all app data in parallel
const [revenues, expenses, categories, ...] = await Promise.all([
  AsyncStorage.getItem(STORAGE_KEYS.REVENUES),
  AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
  // ... other data sources
]);

// 3. Create backup data structure
const backupData = {
  revenues: safeJsonParse(revenues, []),
  expenses: safeJsonParse(expenses, []),
  // ... other data with fallbacks
  timestamp: new Date().toISOString(),
  version: '1.1.0'
};

// 4. Write to file system
const fileName = `finance_backup_${dateString}.json`;
const fileUri = `${backupDir}${fileName}`;
await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));

// 5. Update status and timestamp
backupStatus.status = 'success';
await AsyncStorage.setItem('last_backup_time', timestamp);
```

### Manual Backup System

#### User Interface Integration
Manual backup is accessible through the Settings screen with real-time status display:

```typescript
// Settings screen backup button
<TouchableOpacity onPress={async () => {
  const filePath = await backupService.createBackup();
  if (filePath) {
    Alert.alert('Success', 'Backup created successfully!');
  } else {
    Alert.alert('Error', 'Failed to create backup');
  }
}}>
```

#### Status Display
- **Last backup time**: Formatted timestamp display
- **Backup status**: Real-time status updates (pending, success, failed)
- **User feedback**: Success/error alerts with detailed messages

### App Initialization & Restore

#### First Launch Detection
The app detects first launches and scans for existing backups:

```typescript
// App initialization in _layout.tsx
const isFirstLaunch = !(await storageService.getItem('app_initialized'));

if (isFirstLaunch) {
  const backupFile = await backupService.scanForBackups();
  
  if (backupFile) {
    // Show user confirmation dialog
    Alert.alert(
      'Backup Found',
      'A backup was found. Do you want to restore your data?',
      [
        { text: 'Skip', style: 'cancel' },
        { 
          text: 'Restore',
          onPress: async () => {
            const success = await backupService.restoreFromBackup(backupFile);
            // Handle success/failure
          }
        }
      ]
    );
  }
}
```

#### Backup Scanning Process
1. **Directory Check**: Verifies backup directory exists
2. **File Discovery**: Scans for files matching `finance_backup_*.json` pattern
3. **Latest Selection**: Returns most recent backup file
4. **Error Handling**: Graceful handling of missing directories or files

#### Restoration Process
```typescript
async restoreFromBackup(filePath: string): Promise<boolean> {
  // 1. Read backup file
  const backupContent = await FileSystem.readAsStringAsync(filePath);
  
  // 2. Validate content
  if (!backupContent || backupContent.trim() === '') {
    return false;
  }
  
  // 3. Parse and validate JSON
  const backupData = JSON.parse(backupContent);
  if (!backupData || typeof backupData !== 'object') {
    return false;
  }
  
  // 4. Restore data to AsyncStorage
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.REVENUES, JSON.stringify(backupData.revenues || [])),
    AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(backupData.expenses || [])),
    // ... restore all data with fallbacks
  ]);
  
  return true;
}
```

### Data Validation & Safety

#### JSON Parsing Safety
```typescript
private safeJsonParse(jsonString: string | null, defaultValue: any): any {
  // Comprehensive null/undefined checks
  if (!jsonString || 
      jsonString === 'undefined' || 
      jsonString === 'null' || 
      jsonString.trim() === '') {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : defaultValue;
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}
```

#### Data Structure Validation
- **Type checking**: Validates backup data structure before restoration
- **Fallback values**: Provides safe defaults for missing or corrupted data
- **Version tracking**: Backup format versioning for future compatibility
- **Error logging**: Comprehensive error logging for debugging

### Status Management System

#### Real-time Status Tracking
```typescript
interface BackupStatus {
  status: 'success' | 'failed' | 'pending' | 'none';
  lastBackupTime: string | null;
  error: string | null;
}
```

#### Status Listeners
- **UI Components**: Can subscribe to backup status changes
- **Real-time Updates**: Immediate notification of status changes
- **Error Reporting**: Detailed error messages for troubleshooting

### File System Management

#### Directory Structure
```
{DocumentDirectory}/
└── budgy_backup/
    ├── finance_backup_20240115103000.json
    ├── finance_backup_20240114095500.json
    └── finance_backup_20240113142000.json
```

#### File Naming Convention
- **Pattern**: `finance_backup_YYYYMMDDHHMMSS.json`
- **Timestamp**: ISO date format converted to filename-safe format
- **Extension**: `.json` for universal compatibility
- **Sorting**: Lexicographic sorting provides chronological order

#### App Deletion Behavior
- **Backup file persistence**: **NO** - All backup files are deleted when app is uninstalled
- **Storage location**: Files are stored in app's document directory (app sandbox)
- **Data recovery**: Impossible to recover backups after app deletion
- **User recommendation**: Export backup files to external storage before uninstalling
- **Future enhancement**: Cloud backup integration for persistent storage

### Error Handling & Recovery

#### Backup Creation Errors
- **File system errors**: Directory creation failures, write permissions
- **Data collection errors**: AsyncStorage access failures
- **JSON serialization errors**: Circular references, invalid data
- **Status updates**: Error status with detailed error messages

#### Restoration Errors
- **File access errors**: Missing files, read permissions
- **Data validation errors**: Invalid JSON, corrupted data structure
- **Storage errors**: AsyncStorage write failures
- **Graceful degradation**: Partial restoration with error reporting

### Performance Considerations

#### Optimization Strategies
- **Parallel operations**: `Promise.all()` for concurrent data operations
- **Minimal file I/O**: Single file write per backup operation
- **Efficient scanning**: Directory listing with pattern matching
- **Status caching**: In-memory status tracking to reduce storage calls

#### Memory Management
- **Streaming**: Large backup files handled efficiently
- **Cleanup**: Automatic cleanup of temporary data
- **Error boundaries**: Isolated error handling prevents memory leaks

### Integration with App Features

#### Settings Screen Integration
- **Manual backup button**: One-tap backup creation
- **Status display**: Last backup time and current status
- **User feedback**: Success/error notifications

#### Data Context Integration
- **Automatic refresh**: Context refresh after restoration
- **State synchronization**: Ensures UI reflects restored data
- **Loading states**: Proper loading indicators during operations

### Enhanced Backup Options

#### Local Backup System
- **External storage**: Save backups to Downloads (Android) or Documents (iOS) folder
- **Survives app deletion**: Files remain accessible after app uninstallation
- **Platform-specific paths**: Automatic detection of appropriate storage location
- **User accessibility**: Files accessible through file managers and Files app

#### Data Backup & Restore System
- **Minimal data backup**: Recent transactions and essential data only
- **Text-based backup**: Generate copyable backup data strings
- **Manual restore**: Paste backup data for restoration
- **Size optimization**: Automatic data compression for portability
- **Clipboard integration**: Copy backup data for manual transfer

#### Email/Share Export System
- **Multiple sharing options**: Email, messaging apps, cloud storage
- **Universal compatibility**: JSON format works across platforms
- **Attachment support**: Email backup files as attachments
- **Social sharing**: Share via WhatsApp, Telegram, AirDrop, etc.
- **Cloud integration**: Direct sharing to Google Drive, OneDrive, Dropbox

#### Implementation Details
```typescript
// Local backup to external storage
const localPath = await backupService.createLocalBackup();

// Generate backup data string
const backupData = await backupService.generateQRBackup();

// Share backup via native sharing
const shared = await backupService.shareBackup();

// Email backup via native email
const emailed = await backupService.emailBackup('user@example.com');

// Restore from backup data
const restored = await backupService.restoreFromQR(backupData);
```

### Future Enhancements

#### Planned Improvements
- **Cloud backup**: Integration with cloud storage services
- **Backup compression**: Reduce file sizes for large datasets
- **Incremental backups**: Only backup changed data
- **Backup scheduling**: User-configurable backup intervals
- **Multiple backup retention**: Keep multiple backup versions
- **Backup encryption**: Secure backup files with encryption

#### Compatibility Considerations
- **Version migration**: Handle backup format changes
- **Cross-platform**: Ensure backups work across iOS/Android
- **Export formats**: Support for CSV, Excel export
- **Import validation**: Enhanced validation for imported data

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
  
  // Backup integration methods
  async addRevenue(revenue) {
    const result = await super.addRevenue(revenue);
    await backupService.autoBackup(); // Auto-backup trigger
    return result;
  }
  
  async addExpense(expense) {
    const result = await this.expenseStorage.addExpense(expense);
    await backupService.autoBackup(); // Auto-backup trigger
    return result;
  }
  
  // ... all data modification methods trigger auto-backup
}

BackupService {
  // Independent service to avoid circular dependencies
  async createBackup(): Promise<string | null>
  async restoreFromBackup(filePath: string): Promise<boolean>
  async scanForBackups(): Promise<string | null>
  async autoBackup(): Promise<void>
  getBackupStatus(): BackupStatus
}
```

### Backup System Architecture

#### Automatic Backup Triggers
- **Revenue operations**: Add, update, delete revenue entries
- **Expense operations**: Add, update, delete expense entries  
- **Goal operations**: Add, update, delete savings goals
- **Savings transactions**: Add savings to goals with revenue deduction
- **Settings changes**: Currency, language, notification preferences
- **Category management**: Add, update custom categories

#### Backup File Structure
```json
{
  "revenues": [...],
  "expenses": [...], 
  "categories": [...],
  "revenueCategories": [...],
  "settings": {...},
  "userProfile": {...},
  "savings": [...],
  "goals": [...],
  "savingsTransactions": [...],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.1.0"
}
```

#### Backup Storage Locations
- **Internal**: `{DocumentDirectory}/budgy_backup/` (deleted with app)
- **Local**: `Downloads/` (Android) or `Documents/` (iOS) (survives app deletion)
- **External**: Via sharing to cloud storage, email, messaging apps
- **QR Code**: Visual backup for emergency situations

#### Backup Methods
1. **Internal Backup**: Standard app directory backup
2. **Local Backup**: External storage backup (survives uninstall)
3. **Share Backup**: Export via system sharing (apps, cloud, messaging)
4. **Email Backup**: Open email app with backup data
5. **Data Backup**: Generate copyable backup data string
6. **Data Restore**: Paste backup data to restore

#### File Formats & Naming
- **Standard**: `finance_backup_YYYYMMDDHHMMSS.json`
- **Data String**: Compressed JSON with recent data only
- **Format**: JSON with metadata and version tracking
- **Size**: Uncompressed for readability, compressed for QR codes

#### Backup Status Management
- **Real-time status**: Success, failed, pending, none
- **Status listeners**: UI components can subscribe to backup status changes
- **Error handling**: Detailed error messages and graceful fallbacks
- **Last backup tracking**: Timestamp storage and display in settings
- **Method tracking**: Track which backup method was used

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