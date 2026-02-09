<!--
Project: HushMe Store Apps
Company: Matrix Family (matrix.family)
Dev: Brabus (EasyProTech)
Date: 2026-02-09 UTC
Status: Updated
-->

# Contributing to HushMe Store Apps

Thank you for your interest in publishing an app to HushMe Store!

## Before You Start

1. Read the [Getting Started guide](https://mfos.tech/docs/getting-started)
2. Use the [official template](https://github.com/easypro-tech/matrix-family/tree/main/mfos/app-template)
3. Review the [Permissions documentation](https://mfos.tech/docs/permissions)
4. If your app needs a backend, read [App Backends](https://mfos.tech/docs/backends)

## App ID Convention

Your app ID must follow this format:

```
com.yourname.appname
```

Examples:
- `com.johndoe.weatherapp`
- `com.acme.taskmanager`
- `org.community.translator`

**Rules:**
- Lowercase only
- No spaces or special characters (except `.`)
- Use your domain or username
- Must be unique

## Submission Checklist

Before creating a PR, verify:

### Required for All Apps

- [ ] `manifest.json` is valid JSON
- [ ] `manifest.json` has all required fields:
  - `id` — unique app ID
  - `name` — display name
  - `version` — semver (e.g., `1.0.0`)
  - `type` — `standalone`, `provider`, or `widget`
  - `description` — what your app does
  - `author` — your name
  - `permissions` — array of required permissions
  - `entry` — `bundle.js`
  - `icon` — `icon.png` or `icon.svg`
- [ ] Icon is 512x512 (PNG or SVG)
- [ ] `bundle.js` builds without errors
- [ ] Permissions are minimal and justified
- [ ] No hardcoded credentials or tokens

### Additional for Provider Apps

- [ ] Uses standard MFOS UI components (`mfos.ui`)
- [ ] Registers extensions correctly via `mfos.client.registerExtension`
- [ ] Unregisters extensions on unmount
- [ ] Follows HushMe Design System styling

### Additional for Apps with Backend

- [ ] `backend.url` specified in manifest
- [ ] `backend.health` endpoint returns valid status
- [ ] Backend implements CORS for `*.hushme.online`
- [ ] API keys stored encrypted server-side (never in bundle)
- [ ] Backend has rate limiting per user

## App Types

| Type | Description | Backend Required? |
|------|-------------|-------------------|
| `standalone` | Full-screen utility apps | No (usually) |
| `provider` | Client integration (AI, VoIP, themes) | Often yes |
| `widget` | Small UI components | No (usually) |

## Backend Requirements

If your app handles sensitive data (API keys, credentials) or fetches dynamic external data:

### Option 1: Official Backend (Recommended for EasyProTech apps)
Host within `apps.hushme.app/api/backends/`. Benefits:
- Automatic Matrix auth
- Built-in rate limiting
- Encrypted storage
- Audit logging

### Option 2: Self-Hosted Backend
Host your own backend service:

```json
{
  "backend": {
    "url": "https://api.yourcompany.com",
    "health": "/health"
  }
}
```

Requirements:
- `/health` endpoint returning `{"status": "ok"}`
- CORS headers for `*.hushme.online`
- Validate Matrix tokens (recommended)
- 99% uptime target

## Pull Request Process

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/matrix-family
cd matrix-family
```

### 2. Create App Folder

```bash
mkdir -p hushme/store-apps/apps/com.yourname.appname
```

### 3. Copy Build Files

```bash
cp /path/to/your/dist/* hushme/store-apps/apps/com.yourname.appname/
```

### 4. Verify Structure

**Standalone app:**
```
hushme/store-apps/apps/com.yourname.appname/
├── bundle.js      # Required
├── manifest.json  # Required
├── icon.png       # Required
└── locales/       # Optional
    ├── en.json
    └── ru.json
```

**Provider app:**
```
hushme/store-apps/apps/com.yourname.provider/
├── bundle.js      # Required
├── manifest.json  # Required (type: "provider")
├── icon.svg       # Required
└── locales/       # Recommended
    ├── en.json
    └── ru.json
```

### 5. Commit & Push

```bash
git add .
git commit -m "Add com.yourname.appname"
git push origin main
```

### 6. Create Pull Request

Go to GitHub and create a PR from your fork.

Fill out the PR template completely, including:
- App description
- Permission justification
- Backend URL (if applicable)
- Screenshots

## Review Criteria

### Security

- No `eval()`, `new Function()`, or similar
- No access to `document.cookie` outside allowed APIs
- No attempts to access other apps' storage
- No data exfiltration
- API keys never in bundle code

### Permissions

- Only request permissions you actually use
- Justify each permission in PR description
- Prefer lower-risk permissions when possible
- Provider apps: justify `client.*` permissions

### Code Quality

- Bundle should be reasonably sized (< 1MB recommended)
- No obvious bugs or crashes
- Proper error handling
- Clean console (no debug logs in production)

### User Experience

- Clear purpose and functionality
- Responsive UI using MFOS Design System
- Proper loading states
- Localization (at least en, ru recommended)

### Backend (if applicable)

- Health endpoint responds < 5s
- Rate limiting implemented
- Sensitive data encrypted
- No credentials in error responses

## Updates

To update your app:

1. Increment `version` in `manifest.json`
2. Replace `bundle.js` with new build
3. Create new PR

**Note:** Changing permissions requires re-approval.

## Rejection Reasons

Your PR may be rejected if:

- Malicious code detected
- Excessive permissions without justification
- Impersonates another app or developer
- Violates Matrix.org ToS
- Backend does not respond to health checks
- Backend offline > 24 hours
- Low quality or non-functional
- Does not follow MFOS Design System

## Questions?

- [Discussions](https://github.com/easypro-tech/matrix-family/discussions) — questions, ideas
- Documentation: [mfos.tech](https://mfos.tech)