# Android Internal Testing Build — Blockers

**Date:** 2026-05-26
**Task:** t_12199359
**Status:** BLOCKED — requires manual credential setup by Escalion
**Attempts:** 21+

## Summary

Everything on the code/CI side is 100% ready. The ONLY blockers are manual steps
that Escalion must do via web browsers. No further code changes are needed.

## What ONLY Escalion Can Do

### 1. Create Expo Access Token (2 min)
- Open https://expo.dev/settings/access-tokens
- Click "Create Token", name it "GitHub Actions EAS Build"
- Copy the token (starts with `expo_...`)

### 2. Add GitHub Secrets (3 min)
- Open https://github.com/Escalion86/Cheese2/settings/secrets/actions
- Add `EXPO_TOKEN` with the Expo token value
- Add `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` with Google Play service account JSON

### 3. Google Play Console Setup (30 min)
- Create app with package `cheese2.escalion.ru`
- Complete store listing, content rating, data safety
- Upload icon (512x512), feature graphic (1024x500), screenshots (min 2)
- Create service account at Settings → API access → "Release Manager" role
- Create Internal Testing track, add tester emails
- Set privacy policy URL (e.g. https://escalion86.github.io/Cheese2/PRIVACY_POLICY.md)

### 4. Trigger Build (2 min)
- Push to `main` or use "Run workflow" on GitHub Actions tab
- Monitor at https://github.com/Escalion86/Cheese2/actions

### 5. First Manual Upload (5 min) — REQUIRED by Google Play
- Download AAB from GitHub Actions artifacts
- Upload manually to Play Console → Internal Testing → Create new release
- Fill in release notes, review and roll out
- After this, CI/CD handles future uploads automatically

## What's Ready (Nothing to Change)

- ✅ Expo SDK 49, RN 0.72, package `cheese2.escalion.ru`, v1.1.0
- ✅ eas.json with `internal` profile (AAB build)
- ✅ GitHub Actions workflow (build → download AAB → upload to Play Store)
- ✅ Release notes (EN + RU), privacy policy, feature graphic, all icons
- ✅ All M1-T8 features implemented and pushed to GitHub
- ✅ AndroidManifest.xml, build.gradle (targetSdk 34, minSdk 21)
- ✅ App icon (512x512), adaptive icon, splash, notification icon
- ✅ GitHub repo: https://github.com/Escalion86/Cheese2 (branch: main, commit: 83ae63c)

## Why This Worker Cannot Proceed

- Orange Pi ARM64 has no Android SDK/Gradle — cannot build locally
- Insufficient RAM (4-5GB available) for Docker-based Android build
- No GitHub credentials (gh CLI not authenticated, headless server)
- No Expo token available anywhere on the system
- No Google Play service account JSON available
- First AAB upload MUST be manual (Google Play policy)
- Cannot set GitHub Secrets programmatically (requires web UI auth)

## Worker Environment
- Orange Pi 3B, ARM64 Linux, 7.5GB RAM (~4-5GB free), 201GB disk free
- No Android SDK, no Gradle, no GitHub auth, no Expo auth
- SSH key exists for GitHub (code push works) but gh CLI is not authenticated
