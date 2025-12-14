# Native React Native Backup System

## Required Dependencies

Install the React Native File System library:

```bash
npm install react-native-fs
```

For iOS, add to `ios/Podfile`:
```ruby
pod 'RNFS', :path => '../node_modules/react-native-fs'
```

Then run:
```bash
cd ios && pod install
```

## Features Implemented

### 1. Local Backup Option
- **Purpose**: Save backup files to device storage that survives app deletion
- **Implementation**: Uses `react-native-fs` to write to Downloads (Android) or Documents (iOS)
- **Location**: 
  - Android: `DownloadDirectoryPath`
  - iOS: `DocumentDirectoryPath`

### 2. Data Backup & Restore
- **Purpose**: Generate backup data that can be copied/pasted for emergency restore
- **Features**:
  - Generate compressed backup data
  - Copy to clipboard functionality
  - Manual paste and restore
  - Optimized for size limits

### 3. Native Share Export
- **Purpose**: Share backup data via native sharing
- **Features**:
  - Uses React Native's built-in `Share` API
  - Share via messaging apps, email, cloud storage
  - No external dependencies required

### 4. Email Integration
- **Purpose**: Open email app with backup data
- **Implementation**: Uses `Linking` API to open mailto: URLs
- **Features**:
  - Pre-filled subject and body
  - Works with any email app

## Implementation Details

### Backup Service Methods

```typescript
// Local backup to external storage
async createLocalBackup(): Promise<string | null>

// Generate backup data string
async generateQRBackup(): Promise<string | null>

// Share backup via native sharing
async shareBackup(): Promise<boolean>

// Open email with backup data
async emailBackup(recipientEmail?: string): Promise<boolean>

// Restore from backup data
async restoreFromQR(qrData: string): Promise<boolean>
```

### File System Operations

```typescript
// Write to external storage
await RNFS.writeFile(fileUri, JSON.stringify(backupData, null, 2), 'utf8');

// Read from file
const backupContent = await RNFS.readFile(filePath, 'utf8');

// Check if directory exists
const dirExists = await RNFS.exists(backupDir);

// Create directory
await RNFS.mkdir(backupDir);
```

### Native Sharing

```typescript
// Share backup data
const result = await Share.share({
  message: `Budgy App Backup Data:\n\n${backupString}`,
  title: 'Budgy Backup Data'
});
```

### Email Integration

```typescript
// Open email app
const emailUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
await Linking.openURL(emailUrl);
```

## Permissions

### Android
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS
No additional permissions required for document directory access.

## Usage Instructions

### For Users

1. **Local Backup**: Creates a JSON file in Downloads/Documents folder
2. **Share Backup**: Opens native share dialog to send backup data
3. **Generate Backup Data**: Creates copyable backup text
4. **Email Backup**: Opens email app with backup data pre-filled
5. **Restore**: Paste backup data to restore financial information

### File Structure

```
services/
├── backup-service.ts          # Enhanced with native methods
components/
├── QRBackupModal.tsx         # Simplified data backup/restore modal
app/(tabs)/
├── settings.tsx              # Updated with native backup options
```

## Advantages of Native Implementation

1. **No Expo Dependencies**: Works with pure React Native
2. **Smaller Bundle Size**: Uses built-in APIs
3. **Better Performance**: Native file operations
4. **Universal Compatibility**: Works on any React Native setup
5. **Simpler Setup**: Fewer external dependencies

## Error Handling

- File system permission checks
- Directory existence validation
- Data integrity verification
- Graceful fallbacks for unsupported features
- User-friendly error messages

## Security Notes

- Backup files contain sensitive financial data
- Local backups are stored in user-accessible locations
- Shared data should be handled securely
- Consider implementing encryption for sensitive data