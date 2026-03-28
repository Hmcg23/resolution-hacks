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
              Two rhythms, one team
            </ThemedText>
            <ThemedText style={styles.tagline} themeColor="textSecondary">
              Relationship skill, not a period quiz—see rough energy patterns so you can plan dates, give space, and
              dodge avoidable arguments. Models only; she&apos;s the source of truth on how she feels.
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">Your 24-hour energy rhythm</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Typical male-pattern curve: stronger after sleep, quieter late night. Dot follows your phone&apos;s clock
                hour. Chart is 0–100% of this demo curve—not lab numbers.
              </ThemedText>
              <CycleStripChart
                values={TESTOSTERONE_24H}
                activeIndex={hour}
                barColor={MALE_BAR}
                dimColor={MALE_DIM}
                startLabel="12a"
                endLabel="11p"
                yAxisTitle="Relative level"
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <ThemedText type="subtitle">Her ~4-week rhythm (rough model)</ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                Two curves behind the scenes (energy / stress-ish patterns many apps never show partners). Move the day
                below to match where she is in her cycle—day {cycleDay}. Y-axis is 0–100% of each demo curve so you see
                shape, not lab units.
              </ThemedText>
              <ThemedText type="smallBold" style={styles.rowLabel}>
                Curve A — often tracks &quot;social / upbeat&quot; vibes in the model
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
                Curve B — often tracks wind-down / stressy weeks for some people
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
              <ThemedText type="subtitle">Where is she in the month? (demo slider)</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardLede}>
                For the hackathon this is manual—later it&apos;s her choice what (if anything) syncs. The Moves tab uses
                this same day.
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
                <ThemedText type="smallBold">{phase.partnerTitle}</ThemedText>
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
  technicalHint: {
    marginTop: Spacing.two,
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
