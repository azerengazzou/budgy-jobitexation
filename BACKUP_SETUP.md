# Enhanced Backup System Setup

## Required Dependencies

The enhanced backup system requires the following additional dependencies:

```bash
# Install required packages
npm install expo-mail-composer

# Optional: For better QR code generation (if needed)
npm install react-native-qrcode-svg react-native-svg
```

## Features Added

### 1. Local Backup Option
- **Purpose**: Save backup files to device storage that survives app deletion
- **Location**: 
  - Android: `/storage/emulated/0/Download/`
  - iOS: `Documents/` folder (accessible via Files app)
- **Usage**: Tap "Local Backup" in Settings → Backup Options

### 2. QR Code Emergency Backup
- **Purpose**: Generate QR codes for emergency data backup/restore
- **Features**:
  - Generate QR code with essential data
  - Scan QR codes to restore data
  - Copy backup data to clipboard
  - Optimized for QR code size limits
- **Usage**: Settings → QR Code Backup → Generate/Scan QR Code

### 3. Email/Share Export
- **Purpose**: Share backup files via email or other apps
- **Features**:
  - Email backup as attachment
  - Share via messaging apps (WhatsApp, Telegram)
  - Share to cloud storage (Google Drive, OneDrive, Dropbox)
  - Universal JSON format
- **Usage**: Settings → Backup Options → Share/Email Backup

## Implementation Details

### Backup Service Extensions

The `BackupService` class now includes:

```typescript
// Local backup to external storage
async createLocalBackup(): Promise<string | null>

// Generate QR code data
async generateQRBackup(): Promise<string | null>

// Share backup file
async shareBackup(): Promise<boolean>

// Email backup
async emailBackup(recipientEmail?: string): Promise<boolean>

// Restore from QR code
async restoreFromQR(qrData: string): Promise<boolean>
```

### UI Components

- **QRBackupModal**: Modal for generating and scanning QR codes
- **Enhanced Settings Screen**: New backup options in organized sections

### Permissions Required

- **Camera**: For QR code scanning (requested automatically)
- **Storage**: For local backup (handled by Expo FileSystem)

## Usage Instructions

### For Users

1. **Local Backup**: Creates a backup file in your device's Downloads/Documents folder that won't be deleted when you uninstall the app.

2. **Share Backup**: Allows you to send your backup file to cloud storage, email, or messaging apps for safekeeping.

3. **QR Code Backup**: Creates a QR code with your essential data. Screenshot the QR code or copy the data for emergency restore.

4. **Email Backup**: Sends your backup file as an email attachment to yourself or others.

### For Developers

The backup system is modular and extensible. Each backup method is independent and can be used separately or in combination.

## File Structure

```
services/
├── backup-service.ts          # Enhanced with new backup methods
components/
├── QRBackupModal.tsx         # QR code generation and scanning
app/(tabs)/
├── settings.tsx              # Updated with new backup options
```

## Error Handling

All backup methods include comprehensive error handling:
- Permission checks
- File system validation
- Data integrity verification
- User-friendly error messages
- Graceful fallbacks

## Security Considerations

- Backup files contain sensitive financial data
- QR codes should be treated as confidential
- Email backups should use secure email providers
- Local backups are stored in user-accessible locations
- No encryption is currently implemented (planned for future versions)