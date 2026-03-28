/**
 * WomenShell — self-contained women's app with its own tab bar.
 *
 * Rendered as an absolute overlay in _layout.tsx when role === 'woman'.
 * AppTabs stays mounted underneath so expo-router always has its navigation slot.
 *
 * Provides:
 *  - LogsProvider (log store for all three screens)
 *  - WomenNavContext (from use-women-nav.tsx — separate file avoids circular import)
 *  - Custom tab bar that matches the app's visual style
 */

import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { LogsProvider } from '@/features/women/hooks/use-logs';
import { WomenNavContext, type WomenTab } from '@/features/women/hooks/use-women-nav';

// Screen components — imported directly, no expo-router routing needed
import WomenTodayScreen   from '@/app/women/today';
import WomenLogScreen     from '@/app/women/log';
import WomenHistoryScreen from '@/app/women/history';

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS: { id: WomenTab; label: string }[] = [
  { id: 'today',   label: 'Today'   },
  { id: 'log',     label: 'Log'     },
  { id: 'history', label: 'History' },
];

function WomenTabBar({ active, onPress }: {
  active: WomenTab;
  onPress: (tab: WomenTab) => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {TABS.map((t) => {
        const focused = t.id === active;
        return (
          <Pressable
            key={t.id}
            onPress={() => onPress(t.id)}
            style={({ pressed }) => [styles.tabBtn, pressed && { opacity: 0.6 }]}>
            <ThemedView
              type={focused ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.tabBtnInner}>
              <ThemedText type="small" themeColor={focused ? 'text' : 'textSecondary'}>
                {t.label}
              </ThemedText>
            </ThemedView>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function WomenShell() {
  const [activeTab, setActiveTab] = useState<WomenTab>('today');

  return (
    <LogsProvider>
      <WomenNavContext.Provider value={{ navigate: setActiveTab }}>
        <View style={styles.root}>
          <View style={styles.screen}>
            {activeTab === 'today'   && <WomenTodayScreen />}
            {activeTab === 'log'     && <WomenLogScreen />}
            {activeTab === 'history' && <WomenHistoryScreen />}
          </View>
          <WomenTabBar active={activeTab} onPress={setActiveTab} />
        </View>
      </WomenNavContext.Provider>
    </LogsProvider>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    minHeight: Platform.select({ ios: 50, android: 80, default: 50 }),
  },
  tabBtn: { flex: 1, alignItems: 'center' },
  tabBtnInner: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
