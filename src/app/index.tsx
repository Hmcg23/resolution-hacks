import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CycleStripChart } from '@/components/cycle-strip-chart';
import { HerDayPager } from '@/components/her-day-pager';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCycleDay } from '@/context/cycle-day-context';
import {
  CYCLE_MODEL_DISCLAIMER,
  TESTOSTERONE_24H,
} from '@/data/cycleCurves';
import { MEDICAL_DISCLAIMER } from '@/data/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { formatHourLabel } from '@/lib/format-hour';
import { getCyclePhase } from '@/lib/cyclePhase';

const MALE_BAR = '#6B9BFF';
const MALE_DIM = '#3D5A8C';

export default function DashboardScreen() {
  const theme = useTheme();
  const { cycleDay, setCycleDay, selectedHour, setSelectedHour } = useCycleDay();
  const phase = getCyclePhase(cycleDay);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          <ThemedView style={styles.inner}>
            <ThemedText type="title" style={styles.title}>
              Daily testosterone & cycle hormones
            </ThemedText>
            <ThemedText style={styles.tagline} themeColor="textSecondary">
              Relationship skill, not a period quiz—same 24-hour strip for both of you. Swipe her day to match where she
              is in the month; tap any bar to pick an hour. She&apos;s the source of truth on how she feels.
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Testosterone, 24 hours</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Typical male-pattern curve: stronger after sleep, quieter late night. Tap a bar to set the highlighted
                hour (same marker carries to her strips below). Scale is 0–100% on this chart.
              </ThemedText>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Selected: {formatHourLabel(selectedHour)}
              </ThemedText>
              <CycleStripChart
                values={TESTOSTERONE_24H}
                activeIndex={selectedHour}
                barColor={MALE_BAR}
                dimColor={MALE_DIM}
                startLabel="12a"
                endLabel="11p"
                yAxisTitle="Relative level"
                onBarPress={setSelectedHour}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Estrogen & progesterone, 24 hours (one cycle day)</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Swipe sideways for day 1–28, or use the stepper. Hourly bars blend this day&apos;s level toward the next
                day with a mild day/night variation. Same hour column as your chart—tap to pick.
              </ThemedText>
              <HerDayPager
                cycleDay={cycleDay}
                setCycleDay={setCycleDay}
                selectedHour={selectedHour}
                setSelectedHour={setSelectedHour}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Cycle day</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Stays in sync with swiping the cards above. Later, she chooses what (if anything) syncs. Suggestions tab
                uses this same day.
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
                <ThemedText type="subtitle" style={styles.phaseName}>
                  {phase.phaseName}
                </ThemedText>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.phaseSubtitle}>
                  {phase.partnerTitle}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.phaseSummary}>
                  {phase.partnerSummary}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.technicalHint}>
                  {phase.technicalLabel}
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
  cardLede: {
    lineHeight: 20,
    marginTop: -Spacing.two,
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
  phaseName: {
    textAlign: 'left',
  },
  phaseSubtitle: {
    lineHeight: 20,
  },
  phaseSummary: {
    lineHeight: 20,
  },
  technicalHint: {
    marginTop: Spacing.one,
    fontSize: 12,
    opacity: 0.85,
  },
  disclaimerBlock: {
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.four,
  },
  disclaimerGap: {
    marginTop: Spacing.three,
  },
});
