# Release Notes — v1.1.0 (Internal Testing)

## What's New
Initial internal testing build for Android (Expo SDK 49, React Native 0.72.10).

## Features (M1-T8)

| ID | Feature | Status |
|----|---------|--------|
| M1 | App launch and navigation | ✅ |
| M2 | Camera photo capture | ✅ |
| M3 | Media library save/access | ✅ |
| M4 | Push notification registration | ✅ |
| M5 | Device motion / auto-rotate | ✅ |
| M6 | Settings persistence (AsyncStorage) | ✅ |
| M7 | Theme switching (dark/light) | ✅ |
| M8 | About screen | ✅ |

## Known Issues
- Push notifications require a physical device (won't work on emulators)
- Media library permissions must be granted on first use
- Camera requires physical device with camera hardware
- Some Android devices may require manual permission grants in Settings
- WRITE_EXTERNAL_STORAGE permission may show warnings on Android 14+ (handled by Expo MediaLibrary)

## Testing Instructions
1. Install the AAB on your Android device (API 21+)
2. Grant camera permission when prompted on first camera use
3. Grant media library permission when prompted
4. Test photo capture: navigate to Photo screen and capture
5. Verify photos are saved to device gallery
6. Test push notification registration (check logcat for token)
7. Test auto-rotate by tilting the device
8. Test theme toggle in Settings
9. Test settings persistence (close and reopen app)
10. Report any crashes or unexpected behavior

## Build Info
- Expo SDK: 49
- React Native: 0.72.10
- Package: cheese2.escalion.ru
- Version: 1.1.0 (versionCode: 2)
- Build Type: App Bundle (AAB)
- Track: Internal Testing
- CI/CD: GitHub Actions + EAS Build
- Target SDK: 34
- Min SDK: 21
