import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCycleDay } from '@/context/cycle-day-context';
import { COUPLE, todaySummary } from '@/data/mockCouple';
import { MEDICAL_DISCLAIMER } from '@/data/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { getCyclePhase, type CyclePhaseId } from '@/lib/cyclePhase';

type PlaybookCard = {
  title: string;
  body: string;
};

const PHASE_TIPS: Record<CyclePhaseId, PlaybookCard[]> = {
  menstrual: [
    {
      title: 'Keep plans soft',
      body: 'Movie night, takeout, or staying in beats a packed bar if she’s not feeling it. You’re not “boring”—you’re flexible.',
    },
    {
      title: 'Snack / supplies MVP',
      body: 'Grab the thing she likes, keep pain meds or a heat pack around if she uses them. Practical beats performative.',
    },
  ],
  follicular: [
    {
      title: 'Good window to suggest fun stuff',
      body: 'Hikes, shows, double dates—many people have more gas in the tank here. If she says no, drop it; the model isn’t a mind reader.',
    },
    {
      title: 'One question > guessing',
      body: '“Want to do something social this weekend or keep it chill?” lands better than assuming based on a chart.',
    },
  ],
  ovulation: [
    {
      title: 'Offer options, not one locked plan',
      body: 'Some people feel amazing; some feel overstimulated. “A or B?” gives her an out either way.',
    },
  ],
  luteal: [
    {
      title: 'Assume nothing, lower the pressure',
      body: 'If she’s snappy or tired, it might be nothing—or it might be a rough week. Space and low chores often read as care.',
    },
    {
      title: 'Swap the vibe, not her',
      body: 'Quieter night, earlier bedtime, you handling a chore she hates—small moves. Skip “just think positive.”',
    },
  ],
};

const GENERAL_CARDS: PlaybookCard[] = [
  {
    title: 'You’re already ahead',
    body: 'Opening this app is more than most people do. You’re not expected to be an expert—just less clueless and less weird about asking.',
  },
  {
    title: 'Selfish benefits count too',
    body: 'Fewer fights you didn’t see coming, better-timed date ideas, and less foot-in-mouth. Empathy often follows once the awkwardness drops.',
  },
  {
    title: 'Check in, don’t interrogate',
    body: 'Short questions about tonight or this week beat monitoring her like a spreadsheet.',
  },
  {
    title: 'Her body, her call',
    body: 'You support; you don’t decide her health choices. When in doubt, ask what would help—or offer something concrete.',
  },
];

export default function PlaybookScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const { cycleDay } = useCycleDay();
  const phase = getCyclePhase(cycleDay);
  const phaseCards = PHASE_TIPS[phase.id];

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">What you can do</ThemedText>
          <ThemedText style={styles.lede} themeColor="textSecondary">
            Plain prompts based on the day you set on the sync screen (day {cycleDay}). Not a script—steal the vibe, not
            the words.
          </ThemedText>
        </ThemedView>

        {/* From her today — shows when Alex has shared a log entry */}
        {/* Men's dev: this data comes from src/data/mockCouple.ts → todaySummary */}
        {todaySummary && (
          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              From {COUPLE.womanName} today
            </ThemedText>
            <ThemedText type="small">{todaySummary.summaryText}</ThemedText>
            {todaySummary.recommendations.length > 0 && (
              <View style={styles.recList}>
                {todaySummary.recommendations.map((rec, i) => (
                  <ThemedText key={i} type="small" themeColor="textSecondary">
                    • {rec}
                  </ThemedText>
                ))}
              </View>
            )}
          </ThemedView>
        )}

        <ThemedView type="backgroundElement" style={styles.heroCard}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            This week in the model
          </ThemedText>
          <ThemedText type="subtitle">{phase.partnerTitle}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.heroBody}>
            {phase.partnerSummary}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.technical}>
            {phase.technicalLabel}
          </ThemedText>
        </ThemedView>

        {phaseCards.map((card) => (
          <Card key={card.title} title={card.title} body={card.body} />
        ))}

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Always decent moves
        </ThemedText>
        {GENERAL_CARDS.map((card) => (
          <Card key={card.title} title={card.title} body={card.body} />
        ))}

        <ThemedText type="small" themeColor="textSecondary" style={styles.footer}>
          {MEDICAL_DISCLAIMER}
        </ThemedText>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

function Card({ title, body }: PlaybookCard) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="small" style={styles.cardBody}>
        {body}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  header: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  lede: {
    lineHeight: 22,
  },
  heroCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heroBody: {
    lineHeight: 22,
    marginTop: Spacing.one,
  },
  technical: {
    marginTop: Spacing.two,
    opacity: 0.85,
    fontSize: 12,
  },
  sectionLabel: {
    marginTop: Spacing.two,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardBody: {
    lineHeight: 22,
  },
  footer: {
    lineHeight: 20,
    marginTop: Spacing.three,
  },
  recList: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});
