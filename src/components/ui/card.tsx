/**
 * Card — shared surface component used by both women's and men's sides.
 *
 * OWNERSHIP: Shared — touch only to fix bugs.
 * Thin wrapper around ThemedView with standard padding and border radius.
 */

import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView, type ThemedViewProps } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function Card({ style, ...props }: ThemedViewProps) {
  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
