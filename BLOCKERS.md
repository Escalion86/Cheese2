# Android Internal Testing Build — Blocker Report

**Date:** 2026-05-26 07:30
**Task:** t_12199359
**Status:** BLOCKED — requires manual actions by Escalion
**Attempts:** 37+
**Latest CI Run:** #41 (failed — missing EXPO_TOKEN)

## Current State

ALL code is 100% ready. The CI/CD pipeline is fully configured and tested.
The ONLY blocker is missing GitHub Secrets that must be set manually.

### Latest CI Run Failure
- Run #41 failed at step "Validate required secrets"
- EXPO_TOKEN is NOT set → workflow exits before build
- GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is NOT set
- Upload job skipped (depends on successful build)

## Action Items for Escalion

### Step 1: Create Expo Access Token (~2 min)
1. Go to https://expo.dev/settings/access-tokens
2. Click "Create Token", name it "GitHub Actions EAS Build"
3. Copy the token (starts with `expo_...`)

### Step 2: Add GitHub Secrets (~3 min)
1. Go to https://github.com/Escalion86/Cheese2/settings/secrets/actions
2. Add secret: `EXPO_TOKEN` = <token from step 1>
3. Add secret: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` = <JSON from Play Console>

### Step 3: Google Play Console (~30 min)
1. Go to https://play.google.com/console
2. Create app with package `cheese2.escalion.ru`
3. Fill store listing (name, short description, full description)
4. Upload app icon (512x512 — exists in repo)
5. Upload feature graphic (1024x500 — exists in repo)
6. Upload screenshots (min 2 — need real device or emulator)
7. Complete content rating questionnaire
8. Complete data safety section
9. Set privacy policy URL: https://escalion86.github.io/Cheese2/PRIVACY_POLICY.md
10. Go to Settings → API access → Create service account
11. Grant "Release Manager" role to service account
12. Download JSON key file
13. Create Internal Testing track
14. Add tester email addresses

### Step 4: Trigger Build
Once secrets are set, push any commit to main or use "Run workflow" on GitHub Actions tab.
Monitor at: https://github.com/Escalion86/Cheese2/actions

### Step 5: First Manual Upload (REQUIRED by Google Play)
First AAB upload MUST be manual:
1. Download AAB from GitHub Actions artifacts
2. Go to Play Console → Internal Testing → Create new release
3. Upload AAB manually, fill release notes, roll out
4. After this, CI/CD handles future uploads automatically

## What's Ready (No Code Changes Needed)

- Expo SDK 49, RN 0.72, package `cheese2.escalion.ru`, v1.1.0, versionCode 2
- eas.json with `internal` profile (AAB build)
- GitHub Actions workflow (build → download AAB → upload to Play Store)
- Release notes (EN + RU), privacy policy, feature graphic, all icons/splash
- All M1-T8 features implemented on GitHub (commit ad263d0)
- AndroidManifest.xml, build.gradle (targetSdk 34, minSdk 21)
- App signing managed by EAS
- Push notifications via Expo (no google-services.json needed)

## Worker Limitations (Cannot Build Here)

- Orange Pi ARM64: no Android SDK/Java/Gradle
- Insufficient RAM for Docker-based Android build
- gh CLI not authenticated (cannot set secrets programmatically)
- No Expo/Google Play credentials on this machine
- npm install eas-cli times out on this network
