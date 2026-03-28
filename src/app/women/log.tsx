/**
 * Women's Log Entry screen.
 *
 * OWNERSHIP: Women's developer — full ownership of this file.
 *
 * What's here now (starter):
 *   - Mood picker (5 Chip options)
 *   - Period toggle + flow level chips (conditional)
 *   - Symptom multi-select chips
 *   - Energy & pain steppers (same ±/+ pattern as index.tsx)
 *   - Notes text input
 *   - Share with partner toggle
 *   - Save button (logs to console — wire up persistence here)
 *
 * TODO: women-side dev
 *   - Replace console.log save with real state/storage (AsyncStorage, zustand, etc.)
 *   - Navigate back to Today after save
 *   - Pre-populate form from an existing log for today if one exists
 *   - Add date picker if logging for a past day
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { COUPLE } from '@/data/mockCouple';
import { useTheme } from '@/hooks/use-theme';
import type { DailyLog } from '@/types';

// ---------------------------------------------------------------------------
// Picker options
// ---------------------------------------------------------------------------

const MOODS: DailyLog['mood'][] = ['great', 'good', 'okay', 'rough', 'awful'];
const MOOD_LABELS: Record<DailyLog['mood'], string> = {
  great: '😊 Great',
  good: '🙂 Good',
  okay: '😐 Okay',
  rough: '😔 Rough',
  awful: '😞 Awful',
};

const FLOW_LEVELS: DailyLog['flowLevel'][] = ['light', 'medium', 'heavy'];
const FLOW_LABELS: Record<string, string> = {
  light: 'Light',
  medium: 'Medium',
  heavy: 'Heavy',
};

const SYMPTOM_OPTIONS = [
  'cramps',
  'headache',
  'bloating',
  'fatigue',
  'nausea',
  'back pain',
  'mood swings',
  'breast tenderness',
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function WomenLogScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // --- Form state ---
  const [mood, setMood] = useState<DailyLog['mood']>('okay');
  const [onPeriod, setOnPeriod] = useState(false);
  const [periodStartedToday, setPeriodStartedToday] = useState(false);
  const [flowLevel, setFlowLevel] = useState<DailyLog['flowLevel']>('medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [painLevel, setPainLevel] = useState(1);
  const [note, setNote] = useState('');
  const [shareWithPartner, setShareWithPartner] = useState(true);

  function toggleSymptom(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function handleSave() {
    const entry: DailyLog = {
      id: `log-${new Date().toISOString().slice(0, 10)}`,
      date: new Date().toISOString().slice(0, 10),
      onPeriod,
      periodStartedToday,
      flowLevel: onPeriod ? flowLevel : 'none',
      mood,
      symptoms,
      energyLevel,
      painLevel,
      note,
      shareWithPartner,
    };

    // TODO: women-side dev — replace with real persistence
    console.log('[WomenLog] Saved entry:', entry);

    // TODO: women-side dev — navigate back to Today after save
    // router.replace('/women/today');
  }

  return (
    <ThemedView type="background" style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + Spacing.four,
              paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <ThemedText type="subtitle">Log Today</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </ThemedText>

          {/* Mood */}
          <Section label="How are you feeling?">
            <View style={styles.chipRow}>
              {MOODS.map((m) => (
                <Chip
                  key={m}
                  label={MOOD_LABELS[m]}
                  selected={mood === m}
                  onPress={() => setMood(m)}
                />
              ))}
            </View>
          </Section>

          {/* Period */}
          <Section label="Period">
            <ToggleRow
              label="On my period"
              value={onPeriod}
              onToggle={(v) => {
                setOnPeriod(v);
                if (!v) setPeriodStartedToday(false);
              }}
            />
            {onPeriod && (
              <>
                <ToggleRow
                  label="Started today"
                  value={periodStartedToday}
                  onToggle={setPeriodStartedToday}
                />
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.subLabel}>
                  Flow level
                </ThemedText>
                <View style={styles.chipRow}>
                  {FLOW_LEVELS.map((f) => (
                    <Chip
                      key={f}
                      label={FLOW_LABELS[f]}
                      selected={flowLevel === f}
                      onPress={() => setFlowLevel(f)}
                    />
                  ))}
                </View>
              </>
            )}
          </Section>

          {/* Symptoms */}
          <Section label="Symptoms">
            <View style={styles.chipRow}>
              {SYMPTOM_OPTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={symptoms.includes(s)}
                  onPress={() => toggleSymptom(s)}
                />
              ))}
            </View>
          </Section>

          {/* Energy */}
          <Section label={`Energy  ${energyLevel}/5`}>
            <Stepper value={energyLevel} min={1} max={5} onChange={setEnergyLevel} />
          </Section>

          {/* Pain */}
          <Section label={`Pain  ${painLevel}/5`}>
            <Stepper value={painLevel} min={1} max={5} onChange={setPainLevel} />
          </Section>

          {/* Notes */}
          <Section label="Notes (optional)">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Anything else on your mind..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.textInput,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                },
              ]}
            />
          </Section>

          {/* Share toggle */}
          <Section label="">
            <ToggleRow
              label={`Share with ${COUPLE.manName}`}
              value={shareWithPartner}
              onToggle={setShareWithPartner}
            />
            {shareWithPartner && (
              <ThemedText type="small" themeColor="textSecondary">
                {COUPLE.manName} will see a summary and tips — not your raw notes.
              </ThemedText>
            )}
          </Section>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed]}>
            <ThemedText type="smallBold" style={styles.saveText}>
              Save Entry
            </ThemedText>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      {label ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {label.toUpperCase()}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <ThemedText type="small">{label}</ThemedText>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: undefined, true: '#e8667a' }}
        ios_backgroundColor={undefined}
      />
    </View>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={styles.stepperButton}>
        <ThemedView type="backgroundElement" style={styles.stepperBg}>
          <ThemedText type="default">−</ThemedText>
        </ThemedView>
      </Pressable>

      <View style={styles.stepperDots}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <ThemedView
            key={n}
            type={n <= value ? 'backgroundSelected' : 'backgroundElement'}
            style={styles.dot}
          />
        ))}
      </View>

      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={styles.stepperButton}>
        <ThemedView type="backgroundElement" style={styles.stepperBg}>
          <ThemedText type="default">+</ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  subLabel: {
    marginTop: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepperButton: {
    // Pressable wrapper — lets us animate press
  },
  stepperBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDots: {
    flexDirection: 'row',
    gap: Spacing.two,
    flex: 1,
  },
  dot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#e8667a',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  savePressed: {
    opacity: 0.8,
  },
  saveText: {
    color: '#fff',
  },
});
