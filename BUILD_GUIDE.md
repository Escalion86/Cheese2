# Android Internal Testing Build Guide

## Overview
This guide describes how to build and upload the Cheese2 Android app to Google Play Internal Testing track using EAS Build and GitHub Actions.

## Architecture
- **Project**: Expo SDK 49, React Native 0.72.10
- **Build System**: EAS Build (cloud)
- **CI/CD**: GitHub Actions
- **Distribution**: Google Play Internal Testing
- **Package**: `cheese2.escalion.ru`

## Prerequisites

### 1. Expo Account
- Account: `escalion` on https://expo.dev
- EAS project ID: `7676a13a-3d4a-4da0-ad23-5b4df7b3bb38`
- EAS CLI installed locally (optional): `npm install -g eas-cli`

### 2. GitHub Repository
- Repo: https://github.com/Escalion86/Cheese2
- Branch: `main`

### 3. GitHub Secrets (required)
Set these in GitHub → Settings → Secrets and variables → Actions:

| Secret | Description |
|--------|-------------|
| `EXPO_TOKEN` | Expo access token for EAS Build |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Google Play service account JSON |

See `GITHUB_SECRETS.md` for detailed setup instructions.

### 4. Google Play Console
- App created with package `cheese2.escalion.ru`
- Internal Testing track configured
- Store listing completed (name, description, screenshots, etc.)
- Content rating questionnaire completed
- Data safety section completed
- Privacy policy URL configured

## Build Process

### Automatic (push to main)
1. Push to `main` branch triggers GitHub Actions workflow
2. Workflow installs dependencies and runs EAS Build
3. EAS Build produces an AAB (Android App Bundle)
4. Workflow downloads the AAB and uploads to Google Play Internal Testing
5. Internal testers receive the update automatically

### Manual (workflow dispatch)
1. Go to GitHub → Actions → Android Internal Testing
2. Click "Run workflow"
3. Optionally enter custom release notes
4. Click "Run workflow"

### Local build (for debugging)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build locally (requires Android SDK)
eas build --platform android --profile internal --local
```

## Build Profiles

| Profile | Build Type | Distribution | Use Case |
|---------|-----------|--------------|----------|
| `development` | APK | Internal | Development with dev client |
| `preview` | APK | Internal | Preview builds |
| `production` | AAB | External | Production releases |
| `internal` | AAB | Internal | Internal Testing track |

## Version Management

- `version` in `app.json`: Semantic version (e.g., "1.1.0")
- `versionCode` in `app.json` / `build.gradle`: Integer, must increase with each build
- `versionCode` is currently set to `2`

To bump version:
1. Update `version` in `app.json`
2. Update `versionCode` in `app.json` and `android/app/build.gradle`
3. Commit and push

## Play Store Review Guidelines Compliance

### ✅ Implemented
- Target SDK 34 (current requirement)
- Min SDK 21 (Android 5.0+)
- Adaptive icons for Android 8.0+
- Proper permission declarations
- Privacy policy included
- Expo push notifications (no google-services.json needed)
- App signing by EAS (managed by Expo)

### ⚠️ Before Production
- Add feature graphic (1024x500) to Play Store listing
- Add screenshots for all supported device types
- Complete content rating questionnaire
- Complete data safety section
- Test on multiple Android versions (API 21, 28, 33, 34)

## Troubleshooting

### EAS Build Fails
1. Check build logs at https://expo.dev/accounts/escalion/projects/Cheese2/builds
2. Verify `EXPO_TOKEN` is valid and not expired
3. Check for dependency conflicts: `npm ci` locally
4. Verify `eas.json` configuration

### Play Store Upload Fails
1. Verify service account has "Release Manager" role in Play Console
2. Check that `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` is the complete JSON key
3. Ensure package name matches: `cheese2.escalion.ru`
4. First upload must be manual (create the track in Play Console first)

### Build Succeeds but App Crashes
1. Check device logcat for errors
2. Verify all assets are bundled correctly
3. Test with `eas build --profile preview --local` for faster iteration
4. Check for missing permissions in AndroidManifest.xml

## Release Checklist

- [ ] All M1-T8 features tested and working
- [ ] Version bumped in app.json and build.gradle
- [ ] Release notes updated in RELEASE_NOTES.md
- [ ] GitHub secrets configured (EXPO_TOKEN, GOOGLE_PLAY_SERVICE_ACCOUNT_JSON)
- [ ] Google Play Console listing completed
- [ ] First manual upload done (if first release)
- [ ] Internal testers added in Play Console
- [ ] Push to main triggers successful build
- [ ] AAB uploaded to Internal Testing track
- [ ] Internal testers can install and use the app
