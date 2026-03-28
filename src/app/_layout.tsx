import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DemoRoleSwitcher } from '@/components/demo-role-switcher';
import { CycleDayProvider } from '@/context/cycle-day-context';
import { RoleProvider } from '@/context/role-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* RoleProvider wraps everything so both sides can read the current role */}
      <RoleProvider>
        <CycleDayProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
          {/* Floating demo switcher — visible on all screens, above the tab bar */}
          <DemoRoleSwitcher />
        </CycleDayProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
