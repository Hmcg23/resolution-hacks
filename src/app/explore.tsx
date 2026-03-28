import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  BIRTH_CONTROL_METHODS,
  type BirthControlId,
  type ImpactLevel,
  getBirthControlById,
} from '@/data/birthControl';
import { MEDICAL_DISCLAIMER } from '@/data/disclaimers';
import { useTheme } from '@/hooks/use-theme';

function impactLabel(level: ImpactLevel): string {
  switch (level) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Med';
    case 'high':
      return 'High';
  }
}

export default function LoadoutScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const [selected, setSelected] = useState<BirthControlId>('combo_pill');
  const method = getBirthControlById(selected);

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
          <ThemedText type="subtitle">Decisions for two</ThemedText>
          <ThemedText style={styles.lede} themeColor="textSecondary">
            Birth control isn&apos;t a solo stat sheet—here&apos;s a neutral compare screen you can use before a clinic
            visit. Typical-use numbers from public-health ranges; every body is different.
          </ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.pickerLabel}>
          Method
        </ThemedText>
        <View style={styles.chips}>
          {BIRTH_CONTROL_METHODS.map((m) => {
            const active = m.id === selected;
            return (
              <Pressable key={m.id} onPress={() => setSelected(m.id)} style={styles.chipPress}>
                <ThemedView type={active ? 'backgroundSelected' : 'backgroundElement'} style={styles.chip}>
                  <ThemedText type="small" themeColor={active ? 'text' : 'textSecondary'} numberOfLines={2}>
                    {m.id === 'combo_pill' ? 'Combo pill' : m.id === 'iud' ? 'IUD' : 'Mini-pill'}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          })}
        </View>

        <ThemedView type="backgroundElement" style={styles.panel}>
          <ThemedText type="smallBold">{method.name}</ThemedText>

          <View style={styles.statRow}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Typical use
            </ThemedText>
            <ThemedText type="small" style={styles.statBody}>
              {method.effectivenessTypical}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Perfect use
            </ThemedText>
            <ThemedText type="small" style={styles.statBody}>
              {method.effectivenessPerfect}
            </ThemedText>
          </View>

          <ThemedText type="smallBold" style={styles.themesTitle}>
            Common theme modifiers (illustrative)
          </ThemedText>
          {method.themes.map((t) => (
            <View key={t.label} style={styles.themeLine}>
              <ThemedText type="small" style={styles.themeLabel}>
                {t.label}
              </ThemedText>
              <ThemedView type="backgroundSelected" style={styles.impactBadge}>
                <ThemedText type="smallBold">{impactLabel(t.impact)}</ThemedText>
              </ThemedView>
            </View>
          ))}

          <ThemedText type="small" themeColor="textSecondary" style={styles.clinician}>
            {method.clinicianNote}
          </ThemedText>
        </ThemedView>

        <Collapsible title="Sexual health & consent (basics)">
          <ThemedText type="small" style={styles.collapsibleP}>
            Effectiveness numbers describe pregnancy prevention, not STI prevention—barriers and testing are separate
            conversations.
          </ThemedText>
          <ThemedText type="small" style={styles.collapsibleP}>
            Consent is ongoing, specific, and reversible. Checking in beats assuming—especially if energy, mood, or
            discomfort shifts.
          </ThemedText>
          <ThemedText type="small" style={styles.collapsibleP}>
            If something hurts, feels off, or worries either of you, a clinician or campus health center is the right
            escalation—not this app.
          </ThemedText>
        </Collapsible>

        <ThemedText type="small" themeColor="textSecondary" style={styles.footerDisclaimer}>
          {MEDICAL_DISCLAIMER}
        </ThemedText>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
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
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  header: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  lede: {
    lineHeight: 22,
  },
  pickerLabel: {
    marginBottom: -Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chipPress: {
    flexGrow: 1,
    flexBasis: '30%',
  },
  chip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  panel: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  statRow: {
    gap: Spacing.one,
  },
  statBody: {
    lineHeight: 20,
  },
  themesTitle: {
    marginTop: Spacing.two,
  },
  themeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  themeLabel: {
    flex: 1,
    lineHeight: 20,
  },
  impactBadge: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    minWidth: 44,
    alignItems: 'center',
  },
  clinician: {
    lineHeight: 20,
    marginTop: Spacing.two,
  },
  collapsibleP: {
    lineHeight: 22,
    marginBottom: Spacing.three,
  },
  footerDisclaimer: {
    lineHeight: 20,
    marginTop: Spacing.two,
  },
});
