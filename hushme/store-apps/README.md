<!--
Project: HushMe Store Apps
Company: Matrix Family (matrix.family)
Dev: Brabus (EasyProTech)
Date: 2026-02-09 UTC
Status: Updated
-->

# HushMe Store Apps

Official repository for MFOS applications published to [HushMe Store](https://hushme.store).

## For Users

Browse and install apps directly in the [HushMe client](https://hushme.online).

## For Developers

### How to Submit Your App

1. **Build your app** using [mfos/app-template](../../mfos/app-template)

2. **Fork this repository**

3. **Create your app folder:**
   ```
   apps/com.yourname.appname/
   ├── bundle.js      # Your compiled app
   ├── manifest.json  # App metadata
   └── icon.png       # 512x512 icon (PNG or SVG)
   ```

4. **Create a Pull Request**

5. **Wait for review** — we'll check:
   - manifest.json validity
   - Permissions justification
   - Security scan
   - Backend health (if applicable)

6. **After approval** — your app is published!

### Folder Structure

```
matrix-family/
├── hushme/
│   └── store-apps/
│       ├── apps/
│       │   ├── com.example.counter/
│       │   │   ├── bundle.js
│       │   │   ├── manifest.json
│       │   │   └── icon.png
│       │   └── ...
│       ├── schemas/
│       │   └── manifest.schema.json
│       ├── CONTRIBUTING.md
│       └── README.md
├── .github/
│   ├── workflows/
│   │   ├── validate-pr.yml
│   │   └── publish.yml
│   └── PULL_REQUEST_TEMPLATE.md
└── ...
```

### Requirements

| Requirement | Details |
|-------------|---------|
| App ID | `com.developer.appname` format |
| Icon | 512x512 PNG or SVG |
| Manifest | Valid JSON, all required fields |
| Bundle | ES Module format (React is external) |
| Permissions | Minimal, justified |
| Backend | Health endpoint required (if applicable) |

### Bundle Format

Your `bundle.js` must be an ES module that imports React (provided by HushMe Runtime via shims):

```js
// ✅ Correct: ES module with React imports
import { useState, useCallback } from 'react';

export default function App({ mfos }) {
  const [count, setCount] = useState(0);
  // ... your code
  return <div>...</div>;
}
```

Use the official [mfos/app-template](../../mfos/app-template) which handles this automatically via Vite build with `formats: ['es']`.

### Review Process

1. **Automated checks** (GitHub Actions):
   - JSON schema validation
   - Permissions diff
   - Security scan (eval, document.cookie, etc.)

2. **Manual review**:
   - Code review for security
   - Functionality check
   - UX review

3. **Approval & merge**:
   - App signed by maintainer
   - Published to CDN

### Status Labels

| Label | Meaning |
|-------|---------|
| `pending-review` | Awaiting review |
| `changes-requested` | Needs fixes |
| `approved` | Ready to merge |
| `published` | Live on store |
| `rejected` | Not accepted |

## Documentation

- [Getting Started](https://mfos.tech/docs/getting-started)
- [App Types](https://mfos.tech/docs/app-types)
- [Permissions](https://mfos.tech/docs/permissions)
- [Publishing](https://mfos.tech/docs/publishing)

## Community

- [Discussions](https://github.com/easypro-tech/matrix-family/discussions) — questions, ideas, community apps
- [Issues](https://github.com/easypro-tech/matrix-family/issues) — bugs and actionable reports

## License

Apps in this repository are owned by their respective authors.
Repository infrastructure is MIT licensed.
