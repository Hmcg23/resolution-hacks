/**
 * Women's tab navigator (web).
 *
 * OWNERSHIP: Women's developer — full ownership of this file.
 * Mirrors the pattern of src/components/app-tabs.web.tsx exactly.
 *
 * Uses expo-router/ui for web-compatible tab navigation with
 * the same floating pill aesthetic as the men's web tab bar.
 */

import {
  TabList,
  TabListProps,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from 'expo-router/ui';
import React from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function WomenWebLayout() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <WomenTabList>
          <TabTrigger name="today" href="/women/today" asChild>
            <TabButton>Today</TabButton>
          </TabTrigger>
          <TabTrigger name="log" href="/women/log" asChild>
            <TabButton>Log</TabButton>
          </TabTrigger>
          <TabTrigger name="history" href="/women/history" asChild>
            <TabButton>History</TabButton>
          </TabTrigger>
        </WomenTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function WomenTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <View style={styles.brandBlock}>
          <ThemedText type="smallBold">Partner Lens · Her Side</ThemedText>
          {/* TODO: women-side dev — update tagline */}
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            Track your cycle. Share what matters.
          </ThemedText>
        </View>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    flexWrap: 'wrap',
  },
  brandBlock: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 160,
    marginRight: 'auto',
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
