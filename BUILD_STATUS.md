# Android Internal Testing Build — Status Report
**Date:** 2026-05-25
**Task:** t_12199359
**Repo:** https://github.com/Escalion86/Cheese2 (branch: main, commit: 10220e6)

## Summary

The CI/CD pipeline for Android Internal Testing is fully configured.
The build CANNOT be completed from Orange Pi — it requires cloud build infrastructure (EAS Build)
and credentials that must be configured manually.

## What's Ready

### Repository: https://github.com/Escalion86/Cheese2
- Expo SDK 49, React Native 0.72.10
- Package: `cheese2.escalion.ru`
- Version: 1.1.0 (versionCode: 2)

### CI/CD Pipeline (fully configured)
- File: `.github/workflows/android-internal-testing.yml`
- Trigger: push to `main` or manual dispatch
- Steps: install deps → verify config → EAS build (AAB) → download AAB → upload to Play Store
- Release notes: English + Russian auto-generated

### EAS Configuration
- File: `eas.json`
- Profile: `internal` → AAB build, internal distribution
- EAS project ID: `7676a13a-3d4a-4da0-ad23-5b4df7b3bb38`

### Android Configuration
- `android/app/build.gradle`: applicationId `cheese2.escalion.ru`, targetSdk 34, minSdk 21
- `AndroidManifest.xml`: CAMERA, MEDIA_LOCATION, VIBRATE, INTERNET permissions
- Deep link scheme: `cheese2.escalion.ru`
- RECORD_AUDIO permission removed (previous fix)

### Assets (all present)
- App icon: 512x500 PNG — `assets/images/icon.png` ✅
- Adaptive icon: `assets/images/adaptive-icon.png` ✅
- Splash screen: `assets/images/splash.png` ✅
- Notification icon: `assets/images/notification-icon.png` ✅
- Feature graphic: 1024x500 PNG — `assets/images/feature-graphic.png` ✅ (created 2026-05-25)
- Screenshots: ❌ NOT CREATED (need device screenshots after first build)

### Documentation
- `BUILD_GUIDE.md` — full build guide
- `RELEASE_NOTES.md` — v1.1.0 release notes with M1-T8 features
- `PRIVACY_POLICY.md` — privacy policy (required by Play Store)
- `GITHUB_SECRETS.md` — secrets setup guide

## Blockers (require manual action)

### 1. GitHub Secrets (CRITICAL — blocks everything)
Must be set at: https://github.com/Escalion86/Cheese2/settings/secrets/actions

| Secret | Status | How to create |
|--------|--------|---------------|
| `EXPO_TOKEN` | ❌ NOT SET | https://expo.dev/settings/access-tokens → Create Token |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | ❌ NOT SET | Play Console → Settings → API access → Create service account → JSON key |

### 2. Google Play Console Setup (CRITICAL — blocks upload)
Must be done at: https://play.google.com/console

- [ ] App created with package `cheese2.escalion.ru`
- [ ] Store listing completed (name, description, category)
- [ ] App icon uploaded (512x512 PNG — exists in assets)
- [ ] Feature graphic uploaded (1024x500 PNG — exists in assets, created 2026-05-25)
- [ ] Screenshots uploaded (min 2 per device type — need real device screenshots)
- [ ] Content rating questionnaire completed
- [ ] Data safety section completed
- [ ] Privacy policy URL configured (can use GitHub Pages or raw.githubusercontent.com)
- [ ] Internal Testing track created
- [ ] Internal testers added (email addresses)

### 3. First Upload Must Be Manual
Google Play requires the first AAB upload to be done manually via Play Console.
After that, automated uploads via the GitHub Actions workflow will work.

## How to Complete This Task

### Step 1: Set GitHub Secrets
1. Go to https://expo.dev/settings/access-tokens → Create token → name "GitHub Actions EAS Build"
2. Go to https://github.com/Escalion86/Cheese2/settings/secrets/actions
3. Add `EXPO_TOKEN` with the Expo token value
4. Go to Google Play Console → Settings → API access → Create service account
5. Download JSON key, grant "Release Manager" role
6. Add `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` with the full JSON content

### Step 2: Complete Google Play Console Listing
1. Fill in all required store listing fields
2. Upload feature graphic (1024x500) and screenshots
3. Complete content rating questionnaire
4. Complete data safety section
5. Add privacy policy URL (e.g. https://escalion86.github.io/Cheese2/PRIVACY_POLICY.md)

### Step 3: Trigger Build
1. Push to `main` branch (or use manual workflow dispatch on GitHub)
2. Monitor at: https://github.com/Escalion86/Cheese2/actions
3. Check EAS build logs at: https://expo.dev/accounts/escalion/projects/Cheese2/builds

### Step 4: First Manual Upload (if first release)
1. Download AAB from GitHub Actions artifacts
2. Go to Play Console → Internal Testing → Create new release
3. Upload AAB manually
4. Fill in release notes
5. Review and roll out to internal testers

### Step 5: Verify
1. Internal testers receive the app
2. Test on physical Android device
3. Verify all M1-T8 features work

## M1-T8 Features (all implemented)

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

## Notes
- The app is a photo enhancement tool with playing card overlays
- All data is stored locally (no external servers)
- Push notifications use Expo's service (no google-services.json needed)
- App signing is managed by EAS
- Feature graphic created programmatically (1024x500 PNG, dark theme with card suits)
