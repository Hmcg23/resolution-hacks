/**
 * Women's Today screen.
 *
 * OWNERSHIP: Women's developer — full ownership of this file.
 *
 * What's here now (starter):
 *   - Greeting with her name
 *   - Current cycle phase card (reads from shared CycleDayContext)
 *   - Today's log preview (from mock data)
 *   - "Log Today" CTA
 *
 * TODO: women-side dev
 *   - Replace DAILY_LOGS[0] with real logged state from a local hook/store
 *   - Add cycle day stepper so she can adjust her own cycle day
 *   - Add notification prompt / reminders
 *   - Wire up the share toggle to actually update state
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { StatRow } from '@/components/ui/stat-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useCycleDay } from '@/context/cycle-day-context';
import { COUPLE, todayLog } from '@/data/mockCouple';
import { getCyclePhase } from '@/lib/cyclePhase';

// Mood → emoji mapping
const MOOD_EMOJI: Record<string, string> = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  rough: '😔',
  awful: '😞',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WomenTodayScreen() {
  const { cycleDay } = useCycleDay();
  const phase = getCyclePhase(cycleDay);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const log = todayLog;
  const moodEmoji = MOOD_EMOJI[log.mood] ?? '🙂';

  return (
    <ThemedView type="background" style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greeting}>
          <ThemedText type="title">{getGreeting()},</ThemedText>
          <ThemedText type="title">{COUPLE.womanName}.</ThemedText>
        </View>

        {/* Phase card */}
        <Card style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Cycle day {cycleDay} · {phase.technicalLabel}
          </ThemedText>
          <ThemedText type="subtitle">{phase.partnerTitle}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {phase.partnerSummary}
          </ThemedText>
        </Card>

        {/* Today's log preview */}
        <Card style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Today's log
          </ThemedText>

          <View style={styles.moodRow}>
            <ThemedText style={styles.moodEmoji}>{moodEmoji}</ThemedText>
            <ThemedText type="default">
              Feeling{' '}
              <ThemedText type="default" style={styles.bold}>
                {log.mood}
              </ThemedText>
            </ThemedText>
          </View>

          <StatRow label="Energy" value={`${log.energyLevel}/5`} />
          <StatRow label="Pain" value={`${log.painLevel}/5`} />

          {log.onPeriod && (
            <StatRow label="Flow" value={log.flowLevel} />
          )}

          {log.symptoms.length > 0 && (
            <View style={styles.symptomRow}>
              {log.symptoms.map((s) => (
                <ThemedView key={s} type="backgroundSelected" style={styles.symptomBadge}>
                  <ThemedText type="small">{s}</ThemedText>
                </ThemedView>
              ))}
            </View>
          )}

          <View style={styles.shareRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {log.shareWithPartner
                ? `Shared with ${COUPLE.manName}`
                : 'Not shared with partner'}
            </ThemedText>
          </View>

          {log.note ? (
            <ThemedText type="small" themeColor="textSecondary">
              "{log.note}"
            </ThemedText>
          ) : null}
        </Card>

        {/* CTA */}
        <Pressable
          onPress={() => router.push('/women/log' as never)}
          style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}>
          <ThemedText type="smallBold" style={styles.ctaText}>
            Log Today →
          </ThemedText>
        </Pressable>

        {/* TODO: women-side dev — add cycle day stepper here */}
        {/* TODO: women-side dev — add reminder/notification prompt */}

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  greeting: {
    gap: Spacing.half,
    marginBottom: Spacing.two,
  },
  section: {
    // Card provides its own padding/radius
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  moodEmoji: {
    fontSize: 24,
  },
  bold: {
    fontWeight: '700',
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
  shareRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.2)',
    paddingTop: Spacing.two,
  },
  ctaButton: {
    backgroundColor: '#e8667a',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    color: '#fff',
  },
});
