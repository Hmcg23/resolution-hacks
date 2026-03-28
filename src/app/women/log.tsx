import React, { useEffect, useState } from 'react';
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
import { useWomenNav } from '@/features/women/hooks/use-women-nav';
import { todayISO, useLogs } from '@/features/women/hooks/use-logs';
import { useTheme } from '@/hooks/use-theme';
import type { DailyLog } from '@/types';

const MOODS: DailyLog['mood'][] = ['great', 'good', 'okay', 'rough', 'awful'];
const MOOD_LABELS: Record<DailyLog['mood'], string> = {
  great: '😊 Great', good: '🙂 Good', okay: '😐 Okay', rough: '😔 Rough', awful: '😞 Awful',
};
const FLOW_LEVELS: DailyLog['flowLevel'][] = ['light', 'medium', 'heavy'];
const SYMPTOM_OPTIONS = ['cramps', 'headache', 'bloating', 'fatigue', 'nausea', 'back pain'];

export default function WomenLogScreen() {
  const { saveLog, getLogForDate, setCycleStartDate } = useLogs();
  const { navigate } = useWomenNav();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const today = todayISO();

  // Pre-populate from existing log if present
  const existing = getLogForDate(today);

  const [periodStartedToday, setPeriodStartedToday] = useState(existing?.periodStartedToday ?? false);
  const [onPeriod, setOnPeriod] = useState(existing?.onPeriod ?? false);
  const [flowLevel, setFlowLevel] = useState<DailyLog['flowLevel']>(existing?.flowLevel ?? 'medium');
  const [mood, setMood] = useState<DailyLog['mood']>(existing?.mood ?? 'okay');
  const [symptoms, setSymptoms] = useState<string[]>(existing?.symptoms ?? []);
  const [energyLevel, setEnergyLevel] = useState(existing?.energyLevel ?? 3);
  const [painLevel, setPainLevel] = useState(existing?.painLevel ?? 1);
  const [note, setNote] = useState(existing?.note ?? '');
  const [shareWithPartner, setShareWithPartner] = useState(existing?.shareWithPartner ?? true);

  // If period started today, force onPeriod true
  useEffect(() => {
    if (periodStartedToday) setOnPeriod(true);
  }, [periodStartedToday]);

  function toggleSymptom(s: string) {
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleSave() {
    const entry: DailyLog = {
      id: `log-${today}`,
      date: today,
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
    saveLog(entry);
    // If they marked period started today, update the cycle start date
    if (periodStartedToday) {
      setCycleStartDate(today);
    }
    navigate('today');
  }

  return (
    <ThemedView type="background" style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <ThemedText type="subtitle">Log Today</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </ThemedText>

          {/* ── PERIOD START — hero action ── */}
          <ThemedView
            type="backgroundElement"
            style={[styles.periodHero, periodStartedToday && styles.periodHeroActive]}>
            <View style={styles.periodHeroRow}>
              <View style={styles.periodHeroText}>
                <ThemedText type="smallBold">
                  {periodStartedToday ? '🩸 Period started today' : 'Period started today?'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  This resets your cycle day to 1.
                </ThemedText>
              </View>
              <Switch
                value={periodStartedToday}
                onValueChange={(v) => {
                  setPeriodStartedToday(v);
                  if (v) setOnPeriod(true);
                  else if (!v) setPeriodStartedToday(false);
                }}
                trackColor={{ true: '#e8667a' }}
              />
            </View>

            {/* Still on period (but not day 1) */}
            {!periodStartedToday && (
              <View style={styles.periodHeroRow}>
                <ThemedText type="small">Currently on my period</ThemedText>
                <Switch
                  value={onPeriod}
                  onValueChange={setOnPeriod}
                  trackColor={{ true: '#e8667a' }}
                />
              </View>
            )}

            {/* Flow level */}
            {onPeriod && (
              <>
                <ThemedText type="smallBold" themeColor="textSecondary">Flow level</ThemedText>
                <View style={styles.chipRow}>
                  {FLOW_LEVELS.map((f) => (
                    <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                      selected={flowLevel === f} onPress={() => setFlowLevel(f)} />
                  ))}
                </View>
              </>
            )}
          </ThemedView>

          {/* ── Mood ── */}
          <Section label="Mood">
            <View style={styles.chipRow}>
              {MOODS.map((m) => (
                <Chip key={m} label={MOOD_LABELS[m]} selected={mood === m} onPress={() => setMood(m)} />
              ))}
            </View>
          </Section>

          {/* ── Symptoms ── */}
          <Section label="Symptoms">
            <View style={styles.chipRow}>
              {SYMPTOM_OPTIONS.map((s) => (
                <Chip key={s} label={s} selected={symptoms.includes(s)} onPress={() => toggleSymptom(s)} />
              ))}
            </View>
          </Section>

          {/* ── Energy ── */}
          <Section label={`Energy  ${energyLevel}/5`}>
            <Stepper value={energyLevel} min={1} max={5} onChange={setEnergyLevel} color="#5daa78" />
          </Section>

          {/* ── Pain ── */}
          <Section label={`Pain  ${painLevel}/5`}>
            <Stepper value={painLevel} min={1} max={5} onChange={setPainLevel} color="#e8667a" />
          </Section>

          {/* ── Notes ── */}
          <Section label="Notes">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Anything else..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[styles.textInput, {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }]}
            />
          </Section>

          {/* ── Share ── */}
          <View style={styles.shareRow}>
            <View style={styles.shareText}>
              <ThemedText type="small">Share with {COUPLE.manName}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                He sees a summary, not your raw notes.
              </ThemedText>
            </View>
            <Switch value={shareWithPartner} onValueChange={setShareWithPartner}
              trackColor={{ true: '#e8667a' }} />
          </View>

          {/* ── Save ── */}
          <Pressable onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }]}>
            <ThemedText type="smallBold" style={styles.saveBtnText}>Save Entry</ThemedText>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">{label.toUpperCase()}</ThemedText>
      {children}
    </View>
  );
}

function Stepper({ value, min, max, onChange, color }: {
  value: number; min: number; max: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))}>
        <ThemedView type="backgroundElement" style={styles.stepBtn}>
          <ThemedText type="default">−</ThemedText>
        </ThemedView>
      </Pressable>
      <View style={styles.dots}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <View key={n} style={[styles.dot, { backgroundColor: n <= value ? color : undefined }]}>
            {n > value && <ThemedView type="backgroundElement" style={StyleSheet.absoluteFill} />}
          </View>
        ))}
      </View>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))}>
        <ThemedView type="backgroundElement" style={styles.stepBtn}>
          <ThemedText type="default">+</ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  periodHero: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  periodHeroActive: {
    borderWidth: 1.5,
    borderColor: '#e8667a',
  },
  periodHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  periodHeroText: { flex: 1, gap: Spacing.one },
  section: { gap: Spacing.two },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  textInput: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  shareText: { flex: 1, gap: Spacing.one },
  saveBtn: {
    backgroundColor: '#e8667a',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  stepBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dots: { flex: 1, flexDirection: 'row', gap: Spacing.two },
  dot: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
});
