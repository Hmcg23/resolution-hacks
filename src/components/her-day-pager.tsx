import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { CycleStripChart } from '@/components/cycle-strip-chart';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { estrogenHourlyForDay, progesteroneHourlyForDay } from '@/lib/her-hourly-curves';

const NUM_DAYS = 28;
const E_BAR = '#EC407A';
const E_DIM = '#884060';
const P_BAR = '#B39DDB';
const P_DIM = '#6A5A8C';

type HerDayPagerProps = {
  cycleDay: number;
  setCycleDay: (day: number) => void;
  selectedHour: number;
  setSelectedHour: (hour: number) => void;
};

export function HerDayPager({ cycleDay, setCycleDay, selectedHour, setSelectedHour }: HerDayPagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const skipMomentumRef = useRef(false);

  const scrollToDay = useCallback((day: number, animated: boolean) => {
    if (pageWidth <= 0) return;
    const x = (day - 1) * pageWidth;
    scrollRef.current?.scrollTo({ x, animated });
  }, [pageWidth]);

  useEffect(() => {
    if (pageWidth <= 0) return;
    skipMomentumRef.current = true;
    scrollToDay(cycleDay, false);
    const id = requestAnimationFrame(() => {
      skipMomentumRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [cycleDay, pageWidth, scrollToDay]);

  const onScrollSettle = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (skipMomentumRef.current || pageWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const page = Math.round(x / pageWidth);
      const day = Math.min(NUM_DAYS, Math.max(1, page + 1));
      if (day !== cycleDay) {
        setCycleDay(day);
      }
    },
    [pageWidth, cycleDay, setCycleDay],
  );

  const makeHourly24 = (day: number) => ({
    estrogen: estrogenHourlyForDay(day),
    progesterone: progesteroneHourlyForDay(day),
  });

  return (
    <View
      style={styles.outer}
      onLayout={(e) => {
        const w = Math.floor(e.nativeEvent.layout.width);
        if (w > 0 && w !== pageWidth) {
          setPageWidth(w);
        }
      }}>
      {pageWidth > 0 ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollSettle}
          scrollEventThrottle={16}>
          {Array.from({ length: NUM_DAYS }, (_, i) => {
            const day = i + 1;
            const { estrogen, progesterone } = makeHourly24(day);
            return (
              <View key={day} style={[styles.page, { width: pageWidth }]}>
                <ThemedText type="smallBold" style={styles.rowLabel}>
                  Estrogen
                </ThemedText>
                <CycleStripChart
                  values={estrogen}
                  activeIndex={selectedHour}
                  barColor={E_BAR}
                  dimColor={E_DIM}
                  startLabel="12a"
                  endLabel="11p"
                  onBarPress={setSelectedHour}
                />
                <ThemedText type="smallBold" style={[styles.rowLabel, styles.secondHormone]}>
                  Progesterone
                </ThemedText>
                <CycleStripChart
                  values={progesterone}
                  activeIndex={selectedHour}
                  barColor={P_BAR}
                  dimColor={P_DIM}
                  startLabel="12a"
                  endLabel="11p"
                  onBarPress={setSelectedHour}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : null}
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Swipe to change cycle day · hourly bars blend toward the next day with a mild day/night variation · tap a bar to
        pick hour
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    gap: Spacing.two,
  },
  page: {},
  rowLabel: {
    marginBottom: -Spacing.two,
  },
  secondHormone: {
    marginTop: Spacing.two,
  },
  hint: {
    lineHeight: 18,
    marginTop: Spacing.one,
  },
});
