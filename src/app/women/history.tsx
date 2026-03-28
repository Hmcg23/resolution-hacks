import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { StatRow } from '@/components/ui/stat-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { todayISO, useLogs } from '@/features/women/hooks/use-logs';
import { getCyclePhase } from '@/lib/cyclePhase';
import type { DailyLog } from '@/types';

// ── Phase colours ────────────────────────────────────────────────────────────
const PHASE_BG: Record<string, string> = {
  menstrual:  '#fce8eb',
  follicular: '#e6f7ed',
  ovulation:  '#fef3e0',
  luteal:     '#ede8f7',
};
const PHASE_DARK_BG: Record<string, string> = {
  menstrual:  '#3d1a1f',
  follicular: '#1a3326',
  ovulation:  '#3d2e0a',
  luteal:     '#251a3d',
};
const PHASE_DOT: Record<string, string> = {
  menstrual:  '#e8667a',
  follicular: '#5daa78',
  ovulation:  '#e8a030',
  luteal:     '#8b6bbf',
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const MOOD_EMOJI: Record<string, string> = {
  great: '😊', good: '🙂', okay: '😐', rough: '😔', awful: '😞',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns array of ISO date strings for every day in the given month grid,
 *  null for padding cells. */
function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];

  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push(`${year}-${mm}-${dd}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// ── Calendar day cell ─────────────────────────────────────────────────────────

function DayCell({
  date,
  phaseId,
  log,
  isToday,
  selected,
  onPress,
}: {
  date: string | null;
  phaseId: string | null;
  log: DailyLog | undefined;
  isToday: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  if (!date || !phaseId) {
    return <View style={styles.dayCell} />;
  }

  const dayNum = parseInt(date.slice(8), 10);
  const bg = PHASE_BG[phaseId] ?? '#f5f5f5';
  const dot = PHASE_DOT[phaseId] ?? '#ccc';

  return (
    <Pressable onPress={onPress} style={styles.dayCell}>
      <View style={[
        styles.dayCellInner,
        { backgroundColor: bg },
        selected && styles.dayCellSelected,
        isToday && styles.dayCellToday,
      ]}>
        <ThemedText
          type="small"
          style={[styles.dayNum, isToday && styles.dayNumToday]}>
          {dayNum}
        </ThemedText>

        {/* Phase dot */}
        <View style={[styles.phaseDot, { backgroundColor: dot }]} />

        {/* Period flow bar */}
        {log?.onPeriod && (
          <View style={[styles.periodBar, { backgroundColor: '#e8667a' }]} />
        )}

        {/* Log indicator dot */}
        {log && !log.onPeriod && (
          <View style={styles.logDot} />
        )}
      </View>
    </Pressable>
  );
}

// ── Log detail card ───────────────────────────────────────────────────────────

function LogDetail({ date, log, phaseId }: {
  date: string; log: DailyLog | undefined; phaseId: string;
}) {
  const phase = getCyclePhase(1); // placeholder — overridden below
  const actualPhase = getCyclePhase(
    // Re-derive from phaseId directly via a simple map
    phaseId === 'menstrual' ? 1
    : phaseId === 'follicular' ? 6
    : phaseId === 'ovulation' ? 14
    : 17
  );

  const d = new Date(date + 'T12:00:00');
  const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <Card style={{ borderLeftWidth: 3, borderLeftColor: PHASE_DOT[phaseId] }}>
      <View style={styles.detailHeader}>
        <ThemedText type="smallBold">{label}</ThemedText>
        {log && <ThemedText style={{ fontSize: 20 }}>{MOOD_EMOJI[log.mood]}</ThemedText>}
      </View>

      <ThemedText type="small" themeColor="textSecondary">{actualPhase.partnerTitle}</ThemedText>

      {log ? (
        <>
          <StatRow label="Mood" value={log.mood} />
          <StatRow label="Energy" value={`${log.energyLevel}/5`} />
          {log.onPeriod && <StatRow label="Flow" value={log.flowLevel} />}
          {log.painLevel > 1 && <StatRow label="Pain" value={`${log.painLevel}/5`} />}
          {log.symptoms.length > 0 && (
            <View style={styles.chips}>
              {log.symptoms.map((s) => (
                <ThemedView key={s} type="backgroundSelected" style={styles.chip}>
                  <ThemedText type="small">{s}</ThemedText>
                </ThemedView>
              ))}
            </View>
          )}
          {log.note ? (
            <ThemedText type="small" themeColor="textSecondary">"{log.note}"</ThemedText>
          ) : null}
        </>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">No log for this day.</ThemedText>
      )}
    </Card>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function WomenHistoryScreen() {
  const { getLogForDate, getCycleDayForDate } = useLogs();
  const insets = useSafeAreaInsets();
  const today = todayISO();

  const todayDate = new Date(today + 'T12:00:00');
  const [year, setYear]   = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth());
  const [selected, setSelected] = useState<string | null>(today);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const grid = buildMonthGrid(year, month);
  const selectedPhaseId = selected
    ? getCyclePhase(getCycleDayForDate(selected)).id
    : null;

  return (
    <ThemedView type="background" style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Month nav */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} style={styles.navBtn}>
            <ThemedText type="default">‹</ThemedText>
          </Pressable>
          <ThemedText type="smallBold" style={styles.monthTitle}>
            {MONTH_NAMES[month]} {year}
          </ThemedText>
          <Pressable onPress={nextMonth} style={styles.navBtn}>
            <ThemedText type="default">›</ThemedText>
          </Pressable>
        </View>

        {/* Day-of-week header */}
        <View style={styles.dowRow}>
          {DAY_LABELS.map((l, i) => (
            <View key={i} style={styles.dowCell}>
              <ThemedText type="small" themeColor="textSecondary">{l}</ThemedText>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <ThemedView type="backgroundElement" style={styles.grid}>
          {grid.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map((date, ci) => {
                const phaseId = date ? getCyclePhase(getCycleDayForDate(date)).id : null;
                return (
                  <DayCell
                    key={ci}
                    date={date}
                    phaseId={phaseId}
                    log={date ? getLogForDate(date) : undefined}
                    isToday={date === today}
                    selected={date === selected}
                    onPress={() => date && setSelected(date)}
                  />
                );
              })}
            </View>
          ))}
        </ThemedView>

        {/* Phase legend */}
        <View style={styles.legend}>
          {Object.entries(PHASE_DOT).map(([id, color]) => (
            <View key={id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.legendLabel}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Selected day detail */}
        {selected && selectedPhaseId && (
          <LogDetail
            date={selected}
            log={getLogForDate(selected)}
            phaseId={selectedPhaseId}
          />
        )}

      </ScrollView>
    </ThemedView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CELL_SIZE = 44;

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  navBtn: {
    padding: Spacing.two,
    minWidth: 36,
    alignItems: 'center',
  },
  monthTitle: { fontSize: 16 },
  dowRow: { flexDirection: 'row' },
  dowCell: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: Spacing.one,
  },
  grid: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    padding: Spacing.two,
    gap: 2,
  },
  row: { flexDirection: 'row', gap: 2 },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: CELL_SIZE,
  },
  dayCellInner: {
    flex: 1,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 2,
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: '#e8667a',
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  dayNum: {
    fontSize: 12,
    lineHeight: 14,
  },
  dayNumToday: {
    fontWeight: '700',
  },
  phaseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  periodBar: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    right: 4,
    height: 3,
    borderRadius: 1.5,
  },
  logDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: { fontSize: 12 },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
});
