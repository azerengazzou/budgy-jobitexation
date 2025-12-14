# Android Permissions Fix

## Issue
Local backup failed with permission error: `EACCES (Permission denied)` when trying to write to `/storage/emulated/0/Download/`

## Solution
Updated the backup service to:

1. **Use ExternalDirectoryPath instead of DownloadDirectoryPath**
   - `RNFS.ExternalDirectoryPath` doesn't require special permissions
   - Falls back to `DocumentDirectoryPath` if external path unavailable

2. **Added fallback mechanism**
   - If external storage fails, automatically tries internal storage
   - Provides graceful error handling

3. **Added permission request helper** (optional)
   - Can request WRITE_EXTERNAL_STORAGE permission if needed
   - Currently not used but available for future enhancement

## Android Manifest (Optional)
If you want to use Downloads folder specifically, add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Current Implementation
- **Primary**: Uses `RNFS.ExternalDirectoryPath` (app's external directory)
- **Fallback**: Uses `RNFS.DocumentDirectoryPath` (app's internal directory)
- **Location**: Files saved to app-specific external storage (survives uninstall on some devices)
- **Permissions**: No special permissions required

## File Locations
- **Android External**: `/Android/data/com.yourapp/files/`
- **Android Internal**: `/data/data/com.yourapp/files/`
- **iOS**: `Documents/` folder (accessible via Files app)

## Testing
The backup should now work without permission errors. The file path will be shown in the success message so users know where the backup was saved.