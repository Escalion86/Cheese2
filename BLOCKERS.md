# Android Internal Testing Build — Blockers

**Date:** 2026-05-26
**Task:** t_12199359
**Status:** BLOCKED — requires manual credential setup by Escalion
**Attempts:** 12+

## Blockers

### 1. No EXPO_TOKEN in GitHub Secrets (CRITICAL)
- EAS Build requires an Expo access token to authenticate
- `gh` CLI not authenticated — cannot check/set secrets via CLI
- Workflow run #26411868004 failed at "Validate required secrets" step (attempt 11)
- **Action needed:** Create token at https://expo.dev/settings/access-tokens
- **Then:** Add as `EXPO_TOKEN` to GitHub Secrets at https://github.com/Escalion86/Cheese2/settings/secrets/actions

### 2. No GOOGLE_PLAY_SERVICE_ACCOUNT_JSON in GitHub Secrets (CRITICAL)
- Google Play upload requires a service account JSON key
- No key found anywhere on the server
- **Action needed:** Create service account at Google Play Console → Settings → API access
- **Then:** Add as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` to GitHub Secrets

### 3. Cannot Build Locally on Orange Pi
- Orange Pi is ARM64 Linux — no Android SDK/Gradle
- EAS CLI `npm install -g eas-cli` times out (slow registry on ARM64)
- Docker available but orangepi user has no permissions to Docker socket
- **Workaround:** Use GitHub Actions workflow (cloud build) once secrets are set

### 4. GitHub `gh` CLI Not Authenticated
- Cannot trigger GitHub Actions workflow or check secret status via CLI
- **Action needed:** Either set secrets manually via GitHub UI, or run `gh auth login` with a PAT

## What's Ready

- ✅ Expo project configured (SDK 49, RN 0.72)
- ✅ app.json with package `cheese2.escalion.ru`, version 1.1.0, versionCode 2
- ✅ eas.json with `internal` profile (AAB build, internal distribution)
- ✅ GitHub Actions workflow (`.github/workflows/android-internal-testing.yml`)
- ✅ Release notes (English + Russian) in workflow + whatsnew/ directory
- ✅ Privacy policy (`PRIVACY_POLICY.md`)
- ✅ Feature graphic (1024x500)
- ✅ App icon (1024x1024), adaptive icon, splash screen, notification icon
- ✅ All M1-T8 features implemented
- ✅ Code pushed to GitHub (branch: main)
- ✅ SSH git access works (can push commits)
- ✅ AndroidManifest.xml with all required permissions
- ✅ build.gradle with targetSdk 34, minSdk 21
- ✅ GITHUB_SECRETS.md with detailed setup instructions
- ✅ BUILD_GUIDE.md with full build guide
- ✅ RELEASE_NOTES.md with v1.1.0 release notes and testing instructions

## How to Unblock — Checklist for Escalion

Everything is 100% ready on the code side. Only manual steps remain:

### Step 1: Create Expo Access Token (2 min)
1. Open https://expo.dev/settings/access-tokens
2. Click "Create Token"
3. Name: `GitHub Actions EAS Build`
4. Copy the token value (starts with `expo_...`)

### Step 2: Set GitHub Secrets (3 min)
1. Open https://github.com/Escalion86/Cheese2/settings/secrets/actions
2. Click "New repository secret"
3. Name: `EXPO_TOKEN`, Value: <token from Step 1>
4. Click "Add secret"
5. Repeat for `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` (Step 3)

### Step 3: Create Google Play Service Account (10 min)
1. Open https://play.google.com/console
2. Create app with package `cheese2.escalion.ru`
3. Go to Settings → API access
4. Create service account with "Release Manager" role
5. Download JSON key
6. Paste full JSON content into `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret

### Step 4: Complete Play Console Listing (20-30 min)
1. Fill store listing (name, short description, full description)
2. Upload app icon (512x512 PNG — exists in assets)
3. Upload feature graphic (1024x500 — exists in assets)
4. Upload screenshots (need 2+ real device screenshots — can do after first build)
5. Complete content rating questionnaire
6. Complete data safety section
7. Add privacy policy URL
8. Create Internal Testing track
9. Add tester email addresses

### Step 5: Trigger Build (2 min)
1. Push any commit to `main` OR use "Run workflow" on GitHub Actions tab
2. Monitor at https://github.com/Escalion86/Cheese2/actions
3. Build takes ~15-30 min

### Step 6: Upload to Play Console (5 min)
1. Download AAB from GitHub Actions artifacts
2. First upload must be manual via Play Console
3. After first manual upload, CI/CD handles future uploads automatically

## Worker Environment

- **Machine:** Orange Pi 3B (ARM64 Linux)
- **Hostname:** orangepi
- **OS:** Linux 6.6.0-rc5-rockchip-rk356x
- **Limitations:** No Android SDK, no Gradle, slow npm registry, no GitHub credentials, no Docker permissions
