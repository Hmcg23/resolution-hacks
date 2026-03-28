/**
 * Women's in-app navigation context.
 * Separate file to avoid a circular import between women-shell.tsx and the screen files.
 *
 * women-shell.tsx   → provides WomenNavContext (creates the Provider + sets state)
 * screen files      → consume it via useWomenNav()
 * Both import from this file — neither imports the other.
 */

import React, { createContext, useContext } from 'react';

export type WomenTab = 'today' | 'log' | 'history';

type WomenNavContextValue = { navigate: (tab: WomenTab) => void };

export const WomenNavContext = createContext<WomenNavContextValue | null>(null);

export function useWomenNav(): WomenNavContextValue {
  const ctx = useContext(WomenNavContext);
  if (!ctx) throw new Error('useWomenNav must be used within WomenShell');
  return ctx;
}
