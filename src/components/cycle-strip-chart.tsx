import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StripChartProps = {
  values: number[];
  /** 0-based index to highlight (e.g. current hour or cycle day) */
  activeIndex: number;
  barColor: string;
  dimColor: string;
  /** Optional labels under first / last tick */
  startLabel?: string;
  endLabel?: string;
};

export function CycleStripChart({
  values,
  activeIndex,
  barColor,
  dimColor,
  startLabel,
  endLabel,
}: StripChartProps) {
  const theme = useTheme();
  const max = Math.max(...values, 0.001);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {values.map((v, i) => {
          const h = Math.max(4, (v / max) * 56);
          const isActive = i === activeIndex;
          return (
            <View key={i} style={styles.barSlot}>
              <View
                style={[
                  styles.bar,
                  {
                    height: h,
                    backgroundColor: isActive ? barColor : dimColor,
                    opacity: isActive ? 1 : 0.45,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      {(startLabel || endLabel) && (
        <View style={styles.axis}>
          {startLabel ? (
            <ThemedText type="small" themeColor="textSecondary">
              {startLabel}
            </ThemedText>
          ) : (
            <View />
          )}
          {endLabel ? (
            <ThemedText type="small" themeColor="textSecondary">
              {endLabel}
            </ThemedText>
          ) : (
            <View />
          )}
        </View>
      )}
      <View style={[styles.markerLine, { backgroundColor: theme.textSecondary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 60,
  },
  barSlot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 2,
    width: '100%',
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerLine: {
    height: 1,
    opacity: 0.35,
    marginTop: Spacing.one,
  },
});
