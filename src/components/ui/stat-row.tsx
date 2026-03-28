/**
 * StatRow — shared label + value row used across both sides.
 *
 * OWNERSHIP: Shared — touch only to fix bugs.
 * Example: "Mood" / "good", "Energy" / "4/5", "Typical use" / "93%"
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type StatRowProps = {
  label: string;
  value: string;
};

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.row}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
