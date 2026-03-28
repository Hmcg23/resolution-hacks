import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCycleDay } from '@/context/cycle-day-context';
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
      title: 'Low-pressure plans',
      body: 'Comfort and energy vary—cozy movie night or quiet takeout often land better than a big night out.',
    },
    {
      title: 'Supplies & logistics',
      body: 'Having products, pain relief, and a heat pack on hand is practical support without making it a big speech.',
    },
  ],
  follicular: [
    {
      title: 'Ride the upswing',
      body: 'In this model, estrogen is climbing—many people feel more social and energetic. Good window for hikes, dates, or group plans.',
    },
    {
      title: 'Ask, don’t assume',
      body: '“Up for something active?” beats guessing. She might still want rest—biology is population-level, not a rule.',
    },
  ],
  ovulation: [
    {
      title: 'Peak bandwidth (maybe)',
      body: 'Mid-cycle can feel great for some and overstimulating for others. Offer options and read the room.',
    },
  ],
  luteal: [
    {
      title: 'Progesterone story',
      body: 'In the model, progesterone is higher—some people feel sluggish, irritable, or tender. Patience > pep talks.',
    },
    {
      title: 'Swap the plan',
      body: 'Suggest a mellow night in instead of a loud venue. Small comforts (food, sleep, low chores) read as care.',
    },
  ],
};

const GENERAL_CARDS: PlaybookCard[] = [
  {
    title: 'You’re allowed to learn out loud',
    body: 'Most people were never taught this stuff. Curiosity and humility go further than pretending you already know.',
  },
  {
    title: 'Check in without interrogating',
    body: 'Short, specific questions beat monitoring. “How are you feeling about tonight?” works better than quizzing cycle details.',
  },
  {
    title: 'Her body, her call',
    body: 'Your job is support and shared education—not decisions about her health choices.',
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
          <ThemedText type="subtitle">Playbook</ThemedText>
          <ThemedText style={styles.lede} themeColor="textSecondary">
            Short ideas based on the cycle day you set on the Dashboard ({cycleDay} → {phase.label}). Not a script—adapt
            to your partner.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.heroCard}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Now (model phase)
          </ThemedText>
          <ThemedText type="subtitle">{phase.label}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.heroBody}>
            {phase.summary}
          </ThemedText>
        </ThemedView>

        {phaseCards.map((card) => (
          <Card key={card.title} title={card.title} body={card.body} />
        ))}

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Always useful
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
});
