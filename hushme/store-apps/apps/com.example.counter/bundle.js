/*
 * Example MFOS App: Counter
 * Demonstrates: mfos.storage, mfos.i18n, mfos.ui.components, CSS variables
 * 
 * This is the source code. In production, this would be a minified ES module.
 * Build with: bun run build (using mfos-app-template)
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'counter.value';

export default function App({ mfos }) {
  // Translation helper with fallback
  const t = useCallback(
    (key, params) => mfos.i18n?.t?.(key, params) ?? key,
    [mfos.i18n]
  );

  // Load initial count from storage
  const [count, setCount] = useState(() => {
    try {
      const saved = mfos.storage.get(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Persist count to storage when it changes
  useEffect(() => {
    try {
      mfos.storage.set(STORAGE_KEY, String(count));
    } catch (error) {
      console.error('[Counter] Failed to save:', error);
    }
  }, [count, mfos.storage]);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    try {
      mfos.storage.remove(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, [mfos.storage]);

  // Access MFOS Design System
  const { DSButton, Stack } = mfos.ui.components;
  const { RotateCcw } = mfos.ui.icons;

  const userName = mfos.user.displayName || 'User';

  return (
    <div className="h-full p-4 bg-[var(--bg-color)] text-[var(--text-color)]">
      <Stack direction="column" gap={16} className="max-w-xs mx-auto">
        <div>
          <h1 className="text-xl font-semibold">
            {t('app.greeting', { name: userName })}
          </h1>
          <p className="text-xs text-[var(--secondary-text-color)]">
            {mfos.user.userId}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 p-6 bg-[var(--hover-bg-color)] rounded-lg">
          <span className="text-sm text-[var(--secondary-text-color)]">
            {t('counter.label')}:
          </span>
          <span className="text-5xl font-bold text-[var(--accent-color)] font-mono">
            {count}
          </span>
        </div>

        <Stack direction="row" gap={8}>
          <DSButton variant="primary" onClick={increment} className="flex-1">
            {t('counter.increment')}
          </DSButton>
          <DSButton variant="secondary" onClick={reset} className="flex-1">
            <RotateCcw size={16} className="mr-2" />
            {t('counter.reset')}
          </DSButton>
        </Stack>

        <p className="text-xs text-[var(--secondary-text-color)] text-center italic">
          {t('counter.persistence')}
        </p>
      </Stack>
    </div>
  );
}
