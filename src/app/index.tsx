import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CycleStripChart } from '@/components/cycle-strip-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCycleDay } from '@/context/cycle-day-context';
import {
  CYCLE_MODEL_DISCLAIMER,
  ESTROGEN_28,
  PROGESTERONE_28,
  TESTOSTERONE_24H,
} from '@/data/cycleCurves';
import { MEDICAL_DISCLAIMER } from '@/data/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { getCyclePhase } from '@/lib/cyclePhase';

const MALE_BAR = '#6B9BFF';
const MALE_DIM = '#3D5A8C';
const E_BAR = '#EC407A';
const E_DIM = '#884060';
const P_BAR = '#B39DDB';
const P_DIM = '#6A5A8C';

export default function DashboardScreen() {
  const theme = useTheme();
  const { cycleDay, setCycleDay } = useCycleDay();
  const hour = useMemo(() => new Date().getHours(), []);
  const phase = getCyclePhase(cycleDay);
  const dayIndex = Math.min(28, Math.max(1, cycleDay)) - 1;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.inner}>
            <ThemedText type="title" style={styles.title}>
              Dual engine
            </ThemedText>
            <ThemedText style={styles.tagline} themeColor="textSecondary">
              Same relationship, different biology—population curves for context, not a verdict on anyone&apos;s body.
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Testosterone (24h model)</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Typical pattern: higher after sleep, lower late evening. Marker = your current clock hour.
              </ThemedText>
              <CycleStripChart
                values={TESTOSTERONE_24H}
                activeIndex={hour}
                barColor={MALE_BAR}
                dimColor={MALE_DIM}
                startLabel="12a"
                endLabel="11p"
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <ThemedText type="subtitle">Estrogen / progesterone (28-day model)</ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Two hormones on a simplified cycle. Marker = cycle day you set below (day {cycleDay} → {phase.label}).
              </ThemedText>
              <ThemedText type="smallBold" style={styles.rowLabel}>
                Estrogen
              </ThemedText>
              <CycleStripChart
                values={ESTROGEN_28}
                activeIndex={dayIndex}
                barColor={E_BAR}
                dimColor={E_DIM}
                startLabel="D1"
                endLabel="D28"
              />
              <ThemedText type="smallBold" style={[styles.rowLabel, styles.secondHormone]}>
                Progesterone
              </ThemedText>
              <CycleStripChart
                values={PROGESTERONE_28}
                activeIndex={dayIndex}
                barColor={P_BAR}
                dimColor={P_DIM}
                startLabel="D1"
                endLabel="D28"
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Cycle day (demo input)</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Adjust to explore the curve. Playbook uses this same day.
              </ThemedText>
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => setCycleDay(cycleDay - 1)}
                  style={({ pressed }) => pressed && styles.stepPressed}>
                  <ThemedView type="backgroundSelected" style={styles.stepBtn}>
                    <ThemedText type="subtitle">−</ThemedText>
                  </ThemedView>
                </Pressable>
                <ThemedText type="title" style={styles.dayReadout}>
                  {cycleDay}
                </ThemedText>
                <Pressable
                  onPress={() => setCycleDay(cycleDay + 1)}
                  style={({ pressed }) => pressed && styles.stepPressed}>
                  <ThemedView type="backgroundSelected" style={styles.stepBtn}>
                    <ThemedText type="subtitle">+</ThemedText>
                  </ThemedView>
                </Pressable>
              </View>
              <ThemedView style={[styles.phasePill, { borderColor: theme.textSecondary }]}>
                <ThemedText type="smallBold">{phase.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.phaseSummary}>
                  {phase.summary}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.disclaimerBlock}>
              <ThemedText type="small" themeColor="textSecondary">
                {CYCLE_MODEL_DISCLAIMER}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimerGap}>
                {MEDICAL_DISCLAIMER}
              </ThemedText>
            </ThemedView>

            {Platform.OS === 'web' && <WebBadge />}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.six,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: -Spacing.two,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLede: {
    lineHeight: 20,
    marginTop: -Spacing.two,
  },
  rowLabel: {
    marginBottom: -Spacing.two,
  },
  secondHormone: {
    marginTop: Spacing.two,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
  stepBtn: {
    minWidth: 48,
    minHeight: 48,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPressed: {
    opacity: 0.6,
  },
  dayReadout: {
    minWidth: 56,
    textAlign: 'center',
  },
  phasePill: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.two,
  },
  phaseSummary: {
    lineHeight: 20,
  },
  disclaimerBlock: {
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.four,
  },
  disclaimerGap: {
    marginTop: Spacing.three,
  },
});
