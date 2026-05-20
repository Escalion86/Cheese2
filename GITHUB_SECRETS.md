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
  1. Go to the cheese2 repository on GitHub
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
  1. Go to the cheese2 repository on GitHub
  2. Navigate to Settings → Secrets and variables → Actions
  3. Click "New repository secret"
  4. Name: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
  5. Value: <entire contents of the JSON key file>

## Optional Secrets

### 3. SENTRY_AUTH_TOKEN (future)
- For error tracking integration
- Can be added later when Sentry is configured

## Workflow Triggers

The workflow runs automatically on every push to `main`. It can also be triggered manually from the Actions tab with custom release notes.

## Troubleshooting

- If EAS build fails, check the build logs at https://expo.dev/accounts/escalion/projects/cheese2/builds
- If Play Store upload fails, verify the service account has "Release Manager" permissions
- Ensure the package name `cheese2.escalion.ru` matches in both app.json and Google Play Console
