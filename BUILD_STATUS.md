# Android Internal Testing Build — Status Report
**Date:** 2026-05-26
**Task:** t_12199359
**Repo:** https://github.com/Escalion86/Cheese2 (branch: main, commit: 71de21b)
**Attempts:** 48+ (ALL blocked on missing credentials)

## Summary

The CI/CD pipeline for Android Internal Testing is fully configured.
The build CANNOT be completed without credentials that must be created manually by Escalion.

## What's READY (100%)

- Expo SDK 49, React Native 0.72.10
- Package: `cheese2.escalion.ru`, Version: 1.1.0 (versionCode: 2)
- `.github/workflows/android-internal-testing.yml` — full CI/CD pipeline
- `eas.json` — internal profile (AAB build, internal distribution)
- All assets: icon, adaptive icon, splash, notification icon, feature graphic
- Placeholder screenshots created
- `BUILD_GUIDE.md`, `RELEASE_NOTES.md`, `PRIVACY_POLICY.md`
- `store-listing/` — complete Play Store listing template
- All M1-T8 features implemented
- AndroidManifest.xml, build.gradle (targetSdk 34, minSdk 21)
- App signing managed by EAS (no keystore needed)
- Push notifications via Expo (no google-services.json needed)

## What's BLOCKING (credentials missing)

### 1. EXPO_TOKEN ❌
- **Not set** in env, .env, Hermes config, or GitHub secrets
- **Required for:** EAS Build authentication (both CLI and GitHub Actions)
- **How to create:** https://expo.dev/settings/access-tokens → Create Token
- **Then add to:**
  - GitHub secret at https://github.com/Escalion86/Cheese2/settings/secrets/actions
  - Hermes .env as `EXPO_TOKEN=...` (for local EAS CLI builds)

### 2. GOOGLE_PLAY_SERVICE_ACCOUNT_JSON ❌
- **Not set** anywhere
- **Required for:** Uploading AAB to Google Play Internal Testing
- **How to create:** Play Console → Settings → API access → Create service account → JSON key → Grant "Release Manager" role
- **Then add to:** GitHub secret at https://github.com/Escalion86/Cheese2/settings/secrets/actions

### 3. Google Play Console App Setup ❌
- App must be created with package `cheese2.escalion.ru`
- Store listing, content rating, data safety, privacy policy URL
- Internal Testing track created with testers added
- **First AAB upload must be manual** via Play Console (Google requirement)

### 4. gh CLI Not Authenticated ❌
- Cannot set GitHub secrets from Orange Pi
- Cannot verify if secrets have been set
- Escalion must set secrets manually via GitHub web UI

## How to Complete

1. Create EXPO_TOKEN at https://expo.dev/settings/access-tokens
2. Add EXPO_TOKEN to GitHub secrets + Hermes .env
3. Create Google Play service account JSON at Play Console → Settings → API access
4. Add GOOGLE_PLAY_SERVICE_ACCOUNT_JSON to GitHub secrets
5. Complete Play Console app setup (store listing, content rating, data safety)
6. Push to main branch → GitHub Actions will build and upload automatically
7. Manual first upload via Play Console may be required (Google policy)
