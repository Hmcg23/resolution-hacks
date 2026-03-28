import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { clampCycleDay } from '@/lib/cyclePhase';

type CycleDayContextValue = {
  cycleDay: number;
  setCycleDay: (day: number) => void;
};

const CycleDayContext = createContext<CycleDayContextValue | null>(null);

export function CycleDayProvider({ children }: { children: React.ReactNode }) {
  const [cycleDay, setDay] = useState(14);

  const setCycleDay = useCallback((day: number) => {
    setDay(clampCycleDay(day));
  }, []);

  const value = useMemo(
    () => ({
      cycleDay,
      setCycleDay,
    }),
    [cycleDay, setCycleDay],
  );

  return <CycleDayContext.Provider value={value}>{children}</CycleDayContext.Provider>;
}

export function useCycleDay(): CycleDayContextValue {
  const ctx = useContext(CycleDayContext);
  if (!ctx) {
    throw new Error('useCycleDay must be used within CycleDayProvider');
  }
  return ctx;
}
