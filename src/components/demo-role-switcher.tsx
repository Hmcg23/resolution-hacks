/**
 * DemoRoleSwitcher — floating pill toggle for switching between Her View and His View.
 *
 * OWNERSHIP: Shared — written once, rarely needs changes.
 *
 * This component is absolutely positioned in the root layout, floating above
 * the tab bar on all screens. It calls both setRole() and router.replace()
 * together so the visual state and the navigation are always in sync.
 *
 * Uses router.replace() (not push) so there is no back stack between roles.
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useRole, type Role } from '@/context/role-context';

// Warm rose used only for "Her View" active state — not part of the main theme
const ROSE_ACTIVE = '#e8667a';
const ROSE_ACTIVE_BG = '#fce8eb';
const ROSE_ACTIVE_BG_DARK = '#3d1a1f';

export function DemoRoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleSwitch(next: Role) {
    setRole(next);
    if (next === 'woman') {
      router.replace('/women/today' as never);
    } else {
      router.replace('/' as never);
    }
  }

  // On web the tab bar is at the top, so we float top-right instead
  const positionStyle = Platform.select({
    web: { top: Spacing.three, right: Spacing.three },
    default: { bottom: insets.bottom + BottomTabInset + Spacing.three },
  });

  return (
    <View
      style={[styles.container, positionStyle]}
      pointerEvents="box-none">
      <ThemedView type="backgroundElement" style={styles.pill}>
        <SwitchButton
          label="Her View"
          active={role === 'woman'}
          onPress={() => handleSwitch('woman')}
          activeColor={ROSE_ACTIVE}
          activeBg={ROSE_ACTIVE_BG}
          activeBgDark={ROSE_ACTIVE_BG_DARK}
        />
        <SwitchButton
          label="His View"
          active={role === 'man'}
          onPress={() => handleSwitch('man')}
        />
      </ThemedView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal button
// ---------------------------------------------------------------------------

type SwitchButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
  activeBg?: string;
  activeBgDark?: string;
};

function SwitchButton({
  label,
  active,
  onPress,
  activeColor,
  activeBg,
  activeBgDark,
}: SwitchButtonProps) {
  // Custom background for "Her View" active state; fall back to theme's backgroundSelected
  const customBgStyle =
    active && activeBg
      ? Platform.select({
          // Web: just use the light version; it handles its own dark mode
          web: { backgroundColor: activeBg },
          default: { backgroundColor: activeBg },
        })
      : undefined;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={active && !activeBg ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.switchButton, active && styles.switchButtonActive, customBgStyle]}>
        <ThemedText
          type="smallBold"
          style={active && activeColor ? { color: activeColor } : undefined}
          themeColor={active && !activeColor ? 'text' : 'textSecondary'}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    borderRadius: Spacing.five,
    padding: Spacing.one,
    gap: Spacing.one,
    // Subtle shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  switchButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.five,
  },
  switchButtonActive: {
    // Additional active emphasis handled inline via customBgStyle
  },
  pressed: {
    opacity: 0.7,
  },
});
