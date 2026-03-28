/**
 * Women's History screen.
 *
 * OWNERSHIP: Women's developer — full ownership of this file.
 *
 * What's here now (starter):
 *   - Scrollable list of all mock DailyLog entries
 *   - Each entry: date, mood emoji, flow badge, symptom chips, energy/pain stats
 *   - Period entries are visually distinguished
 *
 * TODO: women-side dev
 *   - Replace DAILY_LOGS with real persisted log data
 *   - Add filtering by month / phase
 *   - Add tap-to-edit a past entry
 *   - Add cycle day indicator per entry
 *   - Add empty state for when there are no logs
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { StatRow } from '@/components/ui/stat-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { DAILY_LOGS } from '@/data/mockCouple';
import type { DailyLog } from '@/types';

// ---------------------------------------------------------------------------
// Mood + flow display helpers
// ---------------------------------------------------------------------------

const MOOD_EMOJI: Record<string, string> = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  rough: '😔',
  awful: '😞',
};

const FLOW_COLOR: Record<string, string> = {
  none: 'transparent',
  light: '#f9b8c3',
  medium: '#e8667a',
  heavy: '#b5344a',
};

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Entry card
// ---------------------------------------------------------------------------

function LogEntryCard({ log }: { log: DailyLog }) {
  const moodEmoji = MOOD_EMOJI[log.mood] ?? '🙂';
  const flowColor = FLOW_COLOR[log.flowLevel] ?? 'transparent';

  return (
    <Card>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <ThemedText type="smallBold">{formatDate(log.date)}</ThemedText>
          {log.onPeriod && (
            <ThemedView style={[styles.flowDot, { backgroundColor: flowColor }]} />
          )}
          {log.periodStartedToday && (
            <ThemedView type="backgroundSelected" style={styles.badge}>
              <ThemedText type="small">Period started</ThemedText>
            </ThemedView>
          )}
        </View>
        <ThemedText style={styles.moodEmoji}>{moodEmoji}</ThemedText>
      </View>

      {/* Stats */}
      <StatRow label="Mood" value={log.mood} />
      <StatRow label="Energy" value={`${log.energyLevel}/5`} />
      {log.painLevel > 1 && <StatRow label="Pain" value={`${log.painLevel}/5`} />}
      {log.onPeriod && <StatRow label="Flow" value={log.flowLevel} />}

      {/* Symptoms */}
      {log.symptoms.length > 0 && (
        <View style={styles.symptomRow}>
          {log.symptoms.map((s) => (
            <ThemedView key={s} type="backgroundSelected" style={styles.symptomBadge}>
              <ThemedText type="small">{s}</ThemedText>
            </ThemedView>
          ))}
        </View>
      )}

      {/* Note */}
      {log.note ? (
        <ThemedText type="small" themeColor="textSecondary">
          "{log.note}"
        </ThemedText>
      ) : null}

      {/* Share indicator */}
      <ThemedText type="small" themeColor="textSecondary">
        {log.shareWithPartner ? '✓ Shared with partner' : 'Not shared'}
      </ThemedText>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function WomenHistoryScreen() {
  const insets = useSafeAreaInsets();

  // TODO: women-side dev — replace with real log data source
  const logs = DAILY_LOGS;

  return (
    <ThemedView type="background" style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>

        <ThemedText type="subtitle">Your History</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {logs.length} entries
        </ThemedText>

        {/* TODO: women-side dev — add month/phase filter chips here */}

        {logs.map((log) => (
          <LogEntryCard key={log.id} log={log} />
        ))}

      </ScrollView>
    </ThemedView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  moodEmoji: {
    fontSize: 20,
  },
  symptomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  symptomBadge: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
});
