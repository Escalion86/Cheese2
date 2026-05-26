# Android Internal Testing Build — FINAL Escalion Action Required
# Task: t_12199359
# Date: 2026-05-26
# Previous attempts: 44+ (ALL failed at identical point)

## Current State
All code is 100% ready on GitHub (branch main, latest commit a627202).
CI/CD pipeline (.github/workflows/android-internal-testing.yml) is fully configured.
EAS build profile "internal" is configured for AAB + internal distribution.
App signing is managed by EAS (no keystore needed from you).

## Why This Keeps Failing
gh CLI is NOT authenticated on Orange Pi → cannot set GitHub secrets.
Orange Pi ARM64 has no Android SDK → cannot build locally.
GitHub secrets EXPO_TOKEN and GOOGLE_PLAY_SERVICE_ACCOUNT_JSON are NOT set.
Without secrets, EAS Build cannot authenticate and Play Store upload cannot happen.

## EXACT Steps for Escalion (copy-paste this list)

### Step 1 — Expo Token (2 minutes)
1. Open https://expo.dev/settings/access-tokens
2. Click "Create Token", name: "GitHub Actions EAS Build"
3. Copy the token (starts with expo_...)

### Step 2 — Google Play Service Account (10 minutes)
1. Open https://play.google.com/console
2. Go to Settings → API access
3. Click "Create new service account"
4. Follow the link to Google Cloud Console
5. Create service account, grant "Release Manager" role
6. Create JSON key, download the file
7. Copy the ENTIRE JSON content

### Step 3 — Set GitHub Secrets (3 minutes)
1. Open https://github.com/Escalion86/Cheese2/settings/secrets/actions
2. Click "New repository secret"
3. Name: EXPO_TOKEN → paste the Expo token from Step 1
4. Click "Add secret"
5. Name: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON → paste the ENTIRE JSON from Step 2
6. Click "Add secret"

### Step 4 — Enable GitHub Pages for Privacy Policy (2 minutes)
1. Open https://github.com/Escalion86/Cheese2/settings/pages
2. Source: Deploy from branch → main → / (root) → Save
3. Verify: https://escalion86.github.io/Cheese2/PRIVACY_POLICY.md

### Step 5 — Complete Google Play Console Listing (30 minutes)
1. Open https://play.google.com/console
2. Create app with package: cheese2.escalion.ru
3. Fill store listing: name "Cheese2", short description, full description
4. Upload app icon: assets/images/icon.png (512x512)
5. Upload feature graphic: assets/images/feature-graphic.png (1024x500)
6. Upload screenshots (min 2 — need real device screenshots)
7. Complete content rating questionnaire
8. Complete data safety section
9. Set privacy policy URL: https://escalion86.github.io/Cheese2/PRIVACY_POLICY.md
10. Create Internal Testing track
11. Add tester email addresses

### Step 6 — Trigger Build
After secrets are set, either:
- Push to main branch, OR
- Go to https://github.com/Escalion86/Cheese2/actions → "Android Internal Testing" → "Run workflow"
Monitor at: https://github.com/Escalion86/Cheese2/actions

### Step 7 — First Manual Upload (REQUIRED by Google Play)
Google Play requires the FIRST AAB upload to be MANUAL:
1. Download AAB from GitHub Actions artifacts
2. Play Console → Internal Testing → Create new release
3. Upload AAB manually, fill release notes, review and roll out
4. After this, CI/CD handles future uploads automatically

## What's Already Done (No Changes Needed)
- Expo SDK 49, RN 0.72, package cheese2.escalion.ru, v1.1.0, versionCode 2
- eas.json with internal profile (AAB build, internal distribution)
- GitHub Actions workflow: build → download AAB → upload to Play Store
- Release notes in English and Russian
- Privacy policy (PRIVACY_POLICY.md)
- Feature graphic, icons, splash screen, notification icon
- All M1-T8 features implemented
- AndroidManifest.xml, build.gradle (targetSdk 34, minSdk 21)
- App signing managed by EAS
- Push notifications via Expo (no google-services.json needed)

## Worker Cannot Do This Because
- gh CLI not authenticated on Orange Pi (can't set secrets)
- Orange Pi ARM64 has no Android SDK/Java/Gradle
- Expo token requires Escalion's Expo login
- Google Play setup requires Escalion's Google account
- First AAB upload must be manual per Google Play policy
