'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'unigue-theme';
const LIGHT = 'uniguelight';
const DARK = 'uniguedark';

/**
 * Sun/moon toggle that flips `data-theme` on <html> between our two daisyUI
 * themes and persists the choice to localStorage. Pairs with the inline
 * anti-flash script in layout.tsx, which sets the initial theme before
 * first paint so there's no flash of the wrong theme on load.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.getAttribute('data-theme') || LIGHT;
// null on the server / during hydration so the first paint matches the server HTML.
const getServerSnapshot = () => null;

export default function ThemeToggle() {
  // The <html data-theme> attribute (set before paint by the script in
  // layout.tsx) is the source of truth; we just observe it.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = theme === DARK ? LIGHT : DARK;
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // Avoid rendering the wrong icon for a frame before we've read the
  // current theme from the DOM on mount.
  if (theme === null) {
    return <button className="btn btn-circle btn-ghost" aria-label="Toggle theme" />;
  }

  const isDark = theme === DARK;

  return (
    <button
      onClick={toggle}
      className="btn btn-circle btn-ghost"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m6.364.386-1.06 1.06M21 12h-1.5m-.386 6.364-1.06-1.06M12 19.5V21m-6.364-.386 1.06-1.06M3 12h1.5m.386-6.364 1.06 1.06M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}
