# GitHub Secrets Setup Guide

This document describes the GitHub secrets required for the Android Internal Testing workflow.

## Required Secrets

### 1. EXPO_TOKEN
- **Description**: Expo access token for EAS Build authentication
- **How to create**:
  1. Go to https://expo.dev/settings/access-tokens
  2. Click "Create Token"
  3. Give it a name (e.g., "GitHub Actions EAS Build")
  4. Copy the token
- **How to add to GitHub**:
  1. Go to the Cheese2 repository on GitHub
  2. Navigate to Settings → Secrets and variables → Actions
  3. Click "New repository secret"
  4. Name: `EXPO_TOKEN`
  5. Value: <your-expo-token>

### 2. GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
- **Description**: Google Play Console service account JSON key for automated uploads
- **How to create**:
  1. Go to Google Play Console → Settings → API access
  2. Click "Create new service account"
  3. Follow the link to Google Cloud Console
  4. Create a new service account with "Service Account User" role
  5. Create a JSON key for the service account
  6. Download the JSON file
  7. Go back to Play Console → API access
  8. Grant "Release Manager" permissions to the service account
- **How to add to GitHub**:
  1. Go to the Cheese2 repository on GitHub
  2. Navigate to Settings → Secrets and variables → Actions
  3. Click "New repository secret"
  4. Name: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
  5. Value: <entire contents of the JSON key file>

## Optional Secrets

### 3. SENTRY_AUTH_TOKEN (future)
- For error tracking integration
- Can be added later when Sentry is configured

## Play Store Listing Requirements

Before the first upload, the following must be configured in Google Play Console:

1. **App name**: Cheese2 (or change to desired name)
2. **Short description** (80 chars max)
3. **Full description** (4000 chars max)
4. **Privacy policy URL**: Required — host PRIVACY_POLICY.md and add URL to Play Console
   - Can be hosted on GitHub Pages: https://escalion86.github.io/cheese2/privacy-policy
   - Or any publicly accessible URL
5. **App category**: Tools / Photography (depending on app purpose)
6. **Target audience**: Must declare age rating via content rating questionnaire
7. **Data safety section**: Declare what data is collected (camera, media library, device motion)
8. **App icon**: 512x512 PNG (already in assets/images/icon.png)
9. **Feature graphic**: 1024x500 PNG/JPG for Play Store listing
10. **Screenshots**: At least 2 screenshots for each supported device type

## First Upload (Manual)

The first AAB upload to Google Play MUST be done manually:
1. Trigger the GitHub Actions workflow (push to main or manual dispatch)
2. Download the AAB from the workflow artifacts
3. Go to Google Play Console → Internal Testing
4. Click "Create new release"
5. Upload the AAB manually
6. Fill in release notes
7. Review and roll out to internal testers

After the first manual upload, subsequent automated uploads will work.

## Workflow Triggers

The workflow runs automatically on every push to `main`. It can also be triggered manually from the Actions tab with custom release notes.

## Troubleshooting

- If EAS build fails, check the build logs at https://expo.dev/accounts/escalion/projects/Cheese2/builds
- If Play Store upload fails, verify the service account has "Release Manager" permissions
- Ensure the package name `cheese2.escalion.ru` matches in both app.json and Google Play Console
- First upload must be done manually via Play Console before automated uploads work
- If build times out, check EAS build queue status at https://expo.dev/troubleshooting/eas-build
