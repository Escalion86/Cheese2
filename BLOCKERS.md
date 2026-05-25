# Android Internal Testing Build — Blockers

**Date:** 2026-05-25
**Task:** t_12199359
**Status:** BLOCKED — requires manual credential setup by Escalion

## Blockers

### 1. No EXPO_TOKEN (CRITICAL)
- EAS Build requires an Expo access token to authenticate
- No token found in environment variables, config files, or GitHub secrets
- `gh` CLI is not authenticated (GH_TOKEN and GITHUB_TOKEN env vars are empty)
- SSH git access works (git@github.com:Escalion86/Cheese2.git) but cannot set secrets via SSH
- **Action needed:** Create token at https://expo.dev/settings/access-tokens
- **Then:** Add as `EXPO_TOKEN` to GitHub Secrets at https://github.com/Escalion86/Cheese2/settings/secrets/actions

### 2. No GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (CRITICAL)
- Google Play upload requires a service account JSON key
- No key found in environment variables or config files
- **Action needed:** Create service account at Google Play Console → Settings → API access
- **Then:** Add as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` to GitHub Secrets

### 3. Cannot Build Locally on Orange Pi
- Orange Pi is ARM64 Linux — no Android SDK/Gradle
- EAS CLI npm install times out (slow registry on ARM64)
- EAS CLI is installed but non-functional (broken binary)
- **Workaround:** Use GitHub Actions workflow (cloud build) once secrets are set

### 4. GitHub `gh` CLI Not Authenticated
- GH_TOKEN and GITHUB_TOKEN environment variables are empty
- Cannot trigger GitHub Actions workflow or check secret status via CLI
- **Action needed:** Run `gh auth login` or set `GITHUB_TOKEN` env var with a PAT

## What's Ready

- ✅ Expo project configured (SDK 49, RN 0.72)
- ✅ app.json with package `cheese2.escalion.ru`, version 1.1.0, versionCode 2
- ✅ eas.json with `internal` profile (AAB build, internal distribution)
- ✅ GitHub Actions workflow (`.github/workflows/android-internal-testing.yml`)
- ✅ Release notes (English + Russian) in workflow
- ✅ Privacy policy (`PRIVACY_POLICY.md`)
- ✅ Feature graphic (1024x500)
- ✅ App icon, adaptive icon, splash screen, notification icon
- ✅ All M1-T8 features implemented
- ✅ Code pushed to GitHub (branch: main, latest commit: 0c79fd5)
- ✅ SSH git access works (can push commits)
- ✅ AndroidManifest.xml with all required permissions
- ✅ build.gradle with targetSdk 34, minSdk 21

## How to Unblock

Escalion must do these steps manually (cannot be automated):

1. **Create Expo token:**
   - Go to https://expo.dev/settings/access-tokens → Create Token
   - Name: "GitHub Actions EAS Build"
   - Copy the token value

2. **Add GitHub Secrets:**
   - Go to https://github.com/Escalion86/Cheese2/settings/secrets/actions
   - Add `EXPO_TOKEN` with the Expo token value
   - Add `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` with the service account JSON

3. **Create Google Play service account:**
   - Go to Google Play Console → Settings → API access
   - Create service account with "Release Manager" role
   - Download JSON key

4. **Complete Google Play Console listing:**
   - Create app with package `cheese2.escalion.ru`
   - Fill store listing, upload screenshots, complete content rating + data safety
   - Create Internal Testing track, add testers

5. **Trigger build:**
   - Push to main or use workflow dispatch on GitHub
   - First upload must be manual via Play Console

## Worker Environment

- **Machine:** Orange Pi 3B (ARM64 Linux)
- **Hostname:** orangepi
- **OS:** Linux 6.6.0-rc5-rockchip-rk356x
- **Limitations:** No Android SDK, no Gradle, slow npm registry, no GitHub credentials
