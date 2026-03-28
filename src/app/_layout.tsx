import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DemoRoleSwitcher } from '@/components/demo-role-switcher';
import { WomenShell } from '@/components/women-shell';
import { CycleDayProvider } from '@/context/cycle-day-context';
import { RoleProvider, useRole } from '@/context/role-context';

/**
 * When role === 'woman', render WomenShell directly and hide AppTabs entirely.
 * NativeTabs must not be in the tree while WomenShell is active — its internal
 * navigation listeners throw "Property 'router' doesn't exist" when they fire
 * during WomenShell's React state updates.
 *
 * A hidden <Slot /> keeps expo-router's router object initialized so the
 * DemoRoleSwitcher (and anything else that may use useRouter) doesn't crash.
 */
function AppShell() {
  const { role } = useRole();

  if (role === 'woman') {
    return (
      <View style={styles.root}>
        <WomenShell />
        {/* Keep expo-router router alive without mounting NativeTabs */}
        <View style={styles.hiddenSlot}>
          <Slot />
        </View>
      </View>
    );
  }

  return <AppTabs />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RoleProvider>
        <CycleDayProvider>
          <AnimatedSplashOverlay />
          <AppShell />
          <DemoRoleSwitcher />
        </CycleDayProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hiddenSlot: { position: 'absolute', width: 0, height: 0, overflow: 'hidden' },
});
