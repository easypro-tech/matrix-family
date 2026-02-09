/*
 * Project: MFOS App Template
 * Company: Matrix Family (matrix.family)
 * Dev: Brabus (EasyProTech)
 * Date: 2026-02-09 UTC
 * Status: Updated - Full example with i18n, storage, UI components
 * Telegram: https://t.me/EasyProTech
 *
 * Main application component
 * Demonstrates: mfos.storage, mfos.i18n, mfos.ui.components, CSS variables
 *
 * IMPORTANT: Tailwind/className utilities are NOT available in MFOS runtime.
 * Always use inline styles with CSS variables for styling.
 */

import { useState, useCallback, useEffect } from 'react';
import type { MFOSApi } from './types';

type AppProps = {
  mfos: MFOSApi;
};

// Storage key for persisting count
const STORAGE_KEY = 'counter.value';

export default function App({ mfos }: AppProps) {
  // Translation helper with fallback
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return mfos.i18n?.t?.(key, params) ?? key;
    },
    [mfos.i18n]
  );

  // State initialization - start with default, load from storage in useEffect
  const [count, setCount] = useState<number>(0);

  // Load saved count from storage on mount
  useEffect(() => {
    try {
      const saved = mfos.storage.get(STORAGE_KEY);
      if (saved) setCount(parseInt(saved, 10));
    } catch { /* ignore */ }
  }, [mfos.storage]);

  // Persist count to storage when it changes
  useEffect(() => {
    try {
      mfos.storage.set(STORAGE_KEY, String(count));
    } catch { /* ignore */ }
  }, [count, mfos.storage]);

  // Increment counter
  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  // Reset counter and clear storage
  const reset = useCallback(() => {
    setCount(0);
    try {
      mfos.storage.remove(STORAGE_KEY);
    } catch {
      // Ignore storage errors on reset
    }
  }, [mfos.storage]);

  // Access MFOS Design System components and icons
  const { DSButton, Stack } = mfos.ui.components;
  const { RotateCcw } = mfos.ui.icons;

  // Get user display name with fallback
  const userName = mfos.user.displayName || 'User';

  // Inline styles with CSS variables (Tailwind NOT available in runtime)
  const styles = {
    container: {
      height: '100%',
      padding: '16px',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
    } as React.CSSProperties,
    inner: {
      maxWidth: '320px',
      margin: '0 auto',
    } as React.CSSProperties,
    title: {
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '4px',
    } as React.CSSProperties,
    subtitle: {
      fontSize: '12px',
      color: 'var(--secondary-text-color)',
    } as React.CSSProperties,
    counterBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '24px',
      backgroundColor: 'var(--hover-bg-color)',
      borderRadius: '8px',
      marginTop: '16px',
    } as React.CSSProperties,
    counterLabel: {
      fontSize: '14px',
      color: 'var(--secondary-text-color)',
    } as React.CSSProperties,
    counterValue: {
      fontSize: '48px',
      fontWeight: 700,
      fontFamily: 'monospace',
      color: 'var(--accent-color)',
    } as React.CSSProperties,
    buttonsRow: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
    } as React.CSSProperties,
    buttonFlex: {
      flex: 1,
    } as React.CSSProperties,
    iconInButton: {
      marginRight: '8px',
    } as React.CSSProperties,
    footer: {
      fontSize: '12px',
      color: 'var(--secondary-text-color)',
      textAlign: 'center' as const,
      fontStyle: 'italic',
      marginTop: '16px',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        {/* Header with localized greeting */}
        <div>
          <h1 style={styles.title}>
            {t('app.greeting', { name: userName })}
          </h1>
          <p style={styles.subtitle}>
            {mfos.user.userId}
          </p>
        </div>

        {/* Counter display */}
        <div style={styles.counterBox}>
          <span style={styles.counterLabel}>
            {t('counter.label')}:
          </span>
          <span style={styles.counterValue}>
            {count}
          </span>
        </div>

        {/* Actions with localized labels */}
        <div style={styles.buttonsRow}>
          <div style={styles.buttonFlex}>
            <DSButton variant="primary" onClick={increment}>
              {t('counter.increment')}
            </DSButton>
          </div>
          <div style={styles.buttonFlex}>
            <DSButton variant="secondary" onClick={reset}>
              <RotateCcw size={16} style={styles.iconInButton} />
              {t('counter.reset')}
            </DSButton>
          </div>
        </div>

        {/* Footer with localized text */}
        <p style={styles.footer}>
          {t('counter.persistence')}
        </p>
      </div>
    </div>
  );
}
