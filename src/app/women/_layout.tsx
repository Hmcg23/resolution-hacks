/**
 * Women's tab navigator (native iOS/Android).
 *
 * OWNERSHIP: Women's developer — full ownership of this file.
 * Mirrors the pattern of src/components/app-tabs.tsx exactly.
 *
 * Routes in this layout: today, log, history
 * Accessed via: /women/today, /women/log, /women/history
 */

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function WomenLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="today">
        <Label>Today</Label>
        <Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="log">
        <Label>Log</Label>
        <Icon src={require('@/assets/images/tabIcons/explore.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <Label>History</Label>
        <Icon src={require('@/assets/images/tabIcons/playbook.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
