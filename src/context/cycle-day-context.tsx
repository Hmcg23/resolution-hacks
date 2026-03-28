import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { clampCycleDay } from '@/lib/cyclePhase';

function clampHour(h: number): number {
  if (Number.isNaN(h) || h < 0) return 0;
  if (h > 23) return 23;
  return Math.round(h);
}

type CycleDayContextValue = {
  cycleDay: number;
  setCycleDay: (day: number) => void;
  selectedHour: number;
  setSelectedHour: (hour: number) => void;
};

const CycleDayContext = createContext<CycleDayContextValue | null>(null);

export function CycleDayProvider({ children }: { children: React.ReactNode }) {
  const [cycleDay, setDay] = useState(14);
  const [selectedHour, setHour] = useState(() => clampHour(new Date().getHours()));

  const setCycleDay = useCallback((day: number) => {
    setDay(clampCycleDay(day));
  }, []);

  const setSelectedHour = useCallback((hour: number) => {
    setHour(clampHour(hour));
  }, []);

  const value = useMemo(
    () => ({
      cycleDay,
      setCycleDay,
      selectedHour,
      setSelectedHour,
    }),
    [cycleDay, setCycleDay, selectedHour, setSelectedHour],
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
