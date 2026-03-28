/**
 * Women's log store — in-memory context that holds all daily logs.
 *
 * Initialized from mock data so the app has content on first open.
 * State persists across tab navigation within a session.
 *
 * Provides:
 *  - logs: all DailyLog entries, newest first
 *  - saveLog(log): upsert by date
 *  - getLogForDate(date): returns the log for a specific ISO date, or undefined
 *  - cycleStartDate: ISO date when the current cycle began
 *  - setCycleStartDate: update when user marks period started
 *  - getCycleDayForDate(date): returns cycle day 1–28 for any ISO date
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { DAILY_LOGS } from '@/data/mockCouple';
import { clampCycleDay } from '@/lib/cyclePhase';
import type { DailyLog } from '@/types';

// The mock data period started on this date (periodStartedToday = true)
const MOCK_CYCLE_START = '2026-03-15';

type LogsContextValue = {
  logs: DailyLog[];
  cycleStartDate: string;
  saveLog: (log: DailyLog) => void;
  getLogForDate: (date: string) => DailyLog | undefined;
  getCycleDayForDate: (date: string) => number;
  setCycleStartDate: (date: string) => void;
};

const LogsContext = createContext<LogsContextValue | null>(null);

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<DailyLog[]>(DAILY_LOGS);
  const [cycleStartDate, setCycleStartDate] = useState(MOCK_CYCLE_START);

  const saveLog = useCallback((newLog: DailyLog) => {
    setLogs((prev) => {
      const filtered = prev.filter((l) => l.date !== newLog.date);
      return [newLog, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
  }, []);

  const getLogForDate = useCallback(
    (date: string): DailyLog | undefined => logs.find((l) => l.date === date),
    [logs],
  );

  const getCycleDayForDate = useCallback(
    (date: string): number => {
      const start = new Date(cycleStartDate + 'T12:00:00');
      const target = new Date(date + 'T12:00:00');
      const diffDays = Math.round((target.getTime() - start.getTime()) / 86_400_000);
      // Wrap to 1–28, handles dates before cycle start too
      return clampCycleDay(((diffDays % 28) + 28) % 28 + 1);
    },
    [cycleStartDate],
  );

  const value = useMemo(
    () => ({ logs, cycleStartDate, saveLog, getLogForDate, getCycleDayForDate, setCycleStartDate }),
    [logs, cycleStartDate, saveLog, getLogForDate, getCycleDayForDate],
  );

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
}

export function useLogs(): LogsContextValue {
  const ctx = useContext(LogsContext);
  if (!ctx) throw new Error('useLogs must be used within LogsProvider');
  return ctx;
}

/** Returns today's ISO date string e.g. "2026-03-28" */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
