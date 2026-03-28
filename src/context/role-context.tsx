/**
 * Role context — tracks which side of the app is currently active.
 *
 * OWNERSHIP: Shared — written once, rarely needs changes.
 * Mirrors the pattern of cycle-day-context.tsx exactly.
 *
 * Default role is 'man' so the existing men's side shows on first launch.
 * The DemoRoleSwitcher calls setRole + router.replace() together.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Role = 'woman' | 'man';

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Default to 'man' — preserves existing app behavior on first launch
  const [role, setRoleState] = useState<Role>('man');

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return ctx;
}
