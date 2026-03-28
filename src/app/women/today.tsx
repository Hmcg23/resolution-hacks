import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { StatRow } from '@/components/ui/stat-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { COUPLE } from '@/data/mockCouple';
import { todayISO, useLogs } from '@/features/women/hooks/use-logs';
import { getCyclePhase } from '@/lib/cyclePhase';
import { useWomenNav } from '@/features/women/hooks/use-women-nav';

const MOOD_EMOJI: Record<string, string> = {
  great: '😊', good: '🙂', okay: '😐', rough: '😔', awful: '😞',
};

const PHASE_COLORS: Record<string, string> = {
  menstrual: '#e8667a',
  follicular: '#5daa78',
  ovulation: '#e8a030',
  luteal: '#8b6bbf',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WomenTodayScreen() {
  const { getLogForDate, getCycleDayForDate } = useLogs();
  const { navigate } = useWomenNav();
  const insets = useSafeAreaInsets();

  const today = todayISO();
  const cycleDay = getCycleDayForDate(today);
  const phase = getCyclePhase(cycleDay);
  const phaseColor = PHASE_COLORS[phase.id];
  const log = getLogForDate(today);

  return (
    <ThemedView type="background" style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View>
          <ThemedText type="title">{greeting()},</ThemedText>
          <ThemedText type="title">{COUPLE.womanName}.</ThemedText>
        </View>

        {/* Phase card */}
        <ThemedView type="backgroundElement" style={[styles.phaseCard, { borderLeftColor: phaseColor }]}>
          <View style={styles.phaseRow}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Day {cycleDay} · {phase.technicalLabel}
            </ThemedText>
            <ThemedView style={[styles.phaseDot, { backgroundColor: phaseColor }]} />
          </View>
          <ThemedText type="subtitle">{phase.partnerTitle}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{phase.partnerSummary}</ThemedText>
        </ThemedView>

        {/* Today's log or empty state */}
        {log ? (
          <Card>
            <View style={styles.logHeader}>
              <ThemedText type="smallBold">Today's log</ThemedText>
              <ThemedText style={styles.moodEmoji}>{MOOD_EMOJI[log.mood]}</ThemedText>
            </View>
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
            <Pressable
              onPress={() => navigate('log')}
              style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}>
              <ThemedText type="small" themeColor="textSecondary">Edit →</ThemedText>
            </Pressable>
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <ThemedText type="smallBold" themeColor="textSecondary">Nothing logged yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Tap below to log today.</ThemedText>
          </Card>
        )}

        {/* Log CTA */}
        <Pressable
          onPress={() => navigate('log')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.8 }]}>
          <ThemedText type="smallBold" style={styles.ctaText}>
            {log ? 'Update Log' : 'Log Today'} →
          </ThemedText>
        </Pressable>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.four, gap: Spacing.three },
  phaseCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    borderLeftWidth: 4,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodEmoji: { fontSize: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  editBtn: { alignSelf: 'flex-end', paddingTop: Spacing.two },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.five },
  cta: {
    backgroundColor: '#e8667a',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
  },
  ctaText: { color: '#fff' },
});
