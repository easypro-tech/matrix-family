<!--
Project: MFOS App Template
Company: EasyProTech LLC (www.easypro.tech)
Dev: Brabus
Date: 2026-02-06 UTC
Status: Updated
Telegram: https://t.me/EasyProTech
-->

# MFOS App Template

Official template for creating MFOS applications for [HushMe Store](https://hushme.store).

## Quick Start

```bash
# Clone this template
git clone https://github.com/EPTLLC/mfos-app-template my-app
cd my-app

# Install dependencies
bun install

# Start development
bun run dev
```

## Project Structure

```
my-app/
├── src/
│   ├── App.tsx       # Main component (edit this!)
│   ├── index.tsx     # Entry point (don't edit)
│   ├── types.ts      # MFOS API types (full definitions)
│   └── vite-env.d.ts # Vite client types
├── public/
│   └── icon.svg      # App icon (SVG preferred, PNG 512x512 also supported)
├── locales/          # Optional: translations
│   ├── en.json
│   └── ru.json
├── manifest.json     # App metadata
├── vite.config.ts    # Build configuration
├── package.json
└── README.md
```

## App Types

MFOS supports three application types:

| Type | Description | Use Case |
|------|-------------|----------|
| `standalone` | Full-screen app | Utilities, games, tools |
| `provider` | Client integration | AI assistants, VoIP, themes |
| `widget` | Small UI element | Clocks, quick actions |

## Configuration

### 1. Edit manifest.json

**Standalone App:**
```json
{
  "id": "com.yourname.myapp",
  "name": "My App",
  "version": "1.0.0",
  "type": "standalone",
  "description": "What your app does",
  "author": "Your Name",
  "contact": "@yourname:matrix.family",
  "permissions": ["storage.read", "storage.write"],
  "entry": "bundle.js",
  "icon": "icon.svg",
  "locales": {
    "default": "en",
    "supported": ["en", "ru"]
  }
}
```

**Provider App (with inline panel):**
```json
{
  "id": "com.yourname.assistant",
  "name": "AI Assistant",
  "version": "1.0.0",
  "type": "provider",
  "description": "AI chat assistant",
  "author": "Your Name",
  "permissions": [
    "storage.read",
    "storage.write",
    "network.fetch",
    "crypto.secureStore"
  ],
  "entry": "bundle.js",
  "icon": "icon.svg",
  "locales": {
    "default": "en",
    "supported": ["en", "ru"]
  }
}
```

**Provider App with Backend:**
```json
{
  "id": "com.yourname.assistant",
  "name": "AI Assistant",
  "version": "1.0.0",
  "type": "provider",
  "description": "AI chat assistant with backend",
  "author": "Your Name",
  "permissions": ["storage.read", "storage.write", "network.fetch"],
  "backend": {
    "url": "https://api.yourapp.com",
    "health": "/health"
  },
  "entry": "bundle.js",
  "icon": "icon.svg"
}
```

### 2. Add your icon

Replace `public/icon.svg` with your app icon. SVG is preferred (scales perfectly), PNG 512x512 also supported.

### 3. Write your app

Edit `src/App.tsx`. Your app receives the `mfos` prop with full API access.

**IMPORTANT:** Tailwind/className utilities are NOT available in MFOS runtime. Always use inline styles with CSS variables:

```tsx
import { useState, useCallback } from 'react';
import type { MFOSApi } from './types';

export default function App({ mfos }: { mfos: MFOSApi }) {
  // Translation helper with fallback
  const t = useCallback(
    (key: string) => mfos.i18n?.t?.(key) ?? key,
    [mfos.i18n]
  );

  // Use storage with try/catch
  const [data, setData] = useState(() => {
    try {
      return mfos.storage.get('myKey') || '';
    } catch {
      return '';
    }
  });
  
  // Use UI components
  const { DSButton } = mfos.ui.components;
  const { Bot } = mfos.ui.icons;
  
  // Inline styles with CSS variables (Tailwind NOT available!)
  const styles = {
    container: {
      padding: '16px',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
    } as React.CSSProperties,
    icon: {
      color: 'var(--accent-color)',
    } as React.CSSProperties,
  };
  
  return (
    <div style={styles.container}>
      <Bot size={24} style={styles.icon} />
      <h1>{t('greeting')}</h1>
      <DSButton onClick={() => setData('clicked')}>
        {t('button.click')}
      </DSButton>
    </div>
  );
}
```

## Provider Apps

Provider apps can register extensions at specific extension points:

```tsx
import { useEffect } from 'react';
import type { MFOSApi } from './types';

function ChatPanel({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  // Your inline panel UI
  return <div>Chat panel for {roomId}</div>;
}

export default function App({ mfos }: { mfos: MFOSApi }) {
  useEffect(() => {
    // Register inline panel in chat header
    mfos.client?.registerExtension('chat_header_inline', {
      id: 'my-assistant',
      tooltip: 'AI Assistant',
      icon: 'Bot',
      position: 'right',
      component: ChatPanel,
    });
    
    return () => {
      mfos.client?.unregisterExtension('chat_header_inline', 'my-assistant');
    };
  }, [mfos.client]);
  
  // Main app UI (settings, etc.)
  return <div>Settings view</div>;
}
```

## UI Design System

MFOS apps have access to HushMe's Design System via `mfos.ui`:

```tsx
const { 
  DSButton, 
  DSIconButton,
  SettingsGroup, 
  SettingsRow,
  SettingsToggle,
  InlinePanel,
  InlinePanelBody,
  InlinePanelInput,
  Modal,
  AccordionGroup,
  AccordionItem,
  TabMenu,
  Stack,
} = mfos.ui.components;

const { Bot, Settings, Send, Sparkles } = mfos.ui.icons;

// Inline styles with CSS variables (Tailwind NOT available!)
const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
};
```

## CSS Variables

Use HushMe CSS variables in inline styles for consistent theming:

```tsx
const styles = {
  container: {
    color: 'var(--text-color)',           // Primary text
    backgroundColor: 'var(--bg-color)',   // Background
  },
  muted: {
    color: 'var(--secondary-text-color)', // Muted text
  },
  card: {
    backgroundColor: 'var(--hover-bg-color)', // Hover states, cards
    border: '1px solid var(--border-color)',  // Borders
  },
  accent: {
    color: 'var(--accent-color)',         // Primary accent (indigo)
  },
  input: {
    backgroundColor: 'var(--input-bg-color)', // Input backgrounds
  },
  error: {
    color: 'var(--color-danger)',             // Error text
    backgroundColor: 'var(--color-danger-muted)', // Error background
  },
};
```

## Development

```bash
# Start dev server with hot reload
bun run dev

# Open http://localhost:5173
```

## Build for Production

```bash
# Build bundle
bun run build
```

Output in `dist/`:
```
dist/
├── bundle.js       # Your app (ES Module format)
├── manifest.json   # Copied from root
├── icon.svg        # Copied from public/
└── locales/        # If you have translations
    ├── en.json
    └── ru.json
```

## How the Build Works

The Vite config compiles your TypeScript/JSX code into an ES Module bundle that:

1. **Uses React shims** — The HushMe client provides React, ReactDOM via Blob URL shims. Your imports (`import React from 'react'`) work transparently.

2. **Exports your component** — The bundle exports default your `App` component for HushMe Runtime to dynamically import.

3. **No bundled dependencies** — React is external and not bundled; it's provided by the client runtime.

## Submit to HushMe Store

1. Fork [hushme-store-apps](https://github.com/EPTLLC/hushme-store-apps)
2. Create folder: `apps/com.yourname.myapp/`
3. Copy `dist/*` into that folder
4. Create Pull Request

## Available Permissions

| Permission | Description |
|------------|-------------|
| `storage.read` | Read app storage |
| `storage.write` | Write app storage |
| `network.fetch` | Make HTTP requests (via gateway) |
| `network.websocket` | WebSocket connections (via gateway) |
| `crypto.secureStore` | Access encrypted local storage |
| `matrix.messages.read` | Read room messages |
| `matrix.messages.write` | Send messages |
| `client.voice.write` | Register as VoIP provider |
| `client.theme.write` | Apply theme customizations |

[Full permissions list](https://mfos.tech/docs/permissions)

## Documentation

- [Getting Started](https://mfos.tech/docs/getting-started)
- [App Types](https://mfos.tech/docs/app-types)
- [Extension Points](https://mfos.tech/docs/extension-points)
- [API Reference](https://mfos.tech/docs/api)
- [Permissions](https://mfos.tech/docs/permissions)
- [Localization](https://mfos.tech/docs/localization)
- [Publishing](https://mfos.tech/docs/publishing)
- [Security Gateway](https://mfos.tech/docs/gateway)

## Need Help?

- Developer Chat: [#dev:matrix.family](https://hushme.space/#/%23dev:matrix.family)
- Developer Support: [@dev:matrix.family](https://hushme.space/#/@dev:matrix.family)
- Discussions: [GitHub Discussions](https://github.com/EPTLLC/mfos-app-template/discussions)

## License

MIT
