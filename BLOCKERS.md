# Android Internal Testing Build — Blockers

**Date:** 2026-05-25
**Task:** t_12199359
**Status:** BLOCKED — requires manual credential setup

## Blockers

### 1. No EXPO_TOKEN (CRITICAL)
- EAS Build requires an Expo access token to authenticate
- No token found in environment variables, config files, or GitHub secrets
- **Action needed:** Create token at https://expo.dev/settings/access-tokens
- **Then:** Add as `EXPO_TOKEN` to GitHub Secrets at https://github.com/Escalion86/Cheese2/settings/secrets/actions

### 2. No GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (CRITICAL)
- Google Play upload requires a service account JSON key
- No key found in environment variables or config files
- **Action needed:** Create service account at Google Play Console → Settings → API access
- **Then:** Add as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` to GitHub Secrets

### 3. No GitHub Authentication (CRITICAL)
- `gh` CLI is not authenticated
- GITHUB_TOKEN env var is empty
- Cannot trigger GitHub Actions workflow or check secret status
- **Action needed:** Run `gh auth login` or set `GITHUB_TOKEN` env var

### 4. Cannot Build Locally on Orange Pi
- Orange Pi is ARM64 Linux — no Android SDK/Gradle
- EAS CLI npm install times out (slow registry on ARM64)
- **Workaround:** Use GitHub Actions workflow (cloud build) once secrets are set

## What's Ready

- ✅ Expo project configured (SDK 49, RN 0.72)
- ✅ app.json with package `cheese2.escalion.ru`, version 1.1.0
- ✅ eas.json with `internal` profile (AAB build)
- ✅ GitHub Actions workflow (`.github/workflows/android-internal-testing.yml`)
- ✅ Release notes (English + Russian)
- ✅ Privacy policy (`PRIVACY_POLICY.md`)
- ✅ Feature graphic (1024x500)
- ✅ All M1-T8 features implemented
- ✅ Code pushed to GitHub (branch: main, commit: 4658801)

## How to Unblock

1. Create Expo access token → add to GitHub Secrets as `EXPO_TOKEN`
2. Create Google Play service account → add to GitHub Secrets as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
3. Authenticate `gh` CLI or set `GITHUB_TOKEN`
4. Trigger workflow: `gh workflow run android-internal-testing.yml`
5. First upload must be manual via Play Console
