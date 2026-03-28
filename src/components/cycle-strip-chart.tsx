import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Chart strip height in px; bars scale as value × plot height (values assumed in [0, 1]). */
const PLOT_HEIGHT = 80;
const MIN_BAR_HEIGHT = 3;
const Y_AXIS_WIDTH = 36;

type StripChartProps = {
  values: number[];
  /** 0-based index to highlight (e.g. current hour or cycle day) */
  activeIndex: number;
  barColor: string;
  dimColor: string;
  /** Optional labels under first / last tick */
  startLabel?: string;
  endLabel?: string;
  /** Shown above the chart; omit when the section heading already names the series */
  yAxisTitle?: string;
  /** When set, bars are tappable (e.g. pick hour of day) */
  onBarPress?: (index: number) => void;
};

export function CycleStripChart({
  values,
  activeIndex,
  barColor,
  dimColor,
  startLabel,
  endLabel,
  yAxisTitle,
  onBarPress,
}: StripChartProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {yAxisTitle ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.yAxisTitle}>
          {yAxisTitle} · scale 0–100%
        </ThemedText>
      ) : null}
      <View style={styles.chartRow}>
        <View style={[styles.yAxisLabels, { height: PLOT_HEIGHT }]}>
          {['100%', '75%', '50%', '25%', '0%'].map((tick) => (
            <ThemedText key={tick} type="small" themeColor="textSecondary" style={styles.yTick}>
              {tick}
            </ThemedText>
          ))}
        </View>
        <View style={styles.plotWrap}>
          <View style={[styles.gridLayer, { height: PLOT_HEIGHT }]}>
            {[0, 0.25, 0.5, 0.75].map((t) => (
              <View
                key={t}
                style={[
                  styles.gridLine,
                  {
                    bottom: `${t * 100}%`,
                    backgroundColor: theme.textSecondary,
                  },
                ]}
              />
            ))}
          </View>
          <View style={[styles.barRow, { height: PLOT_HEIGHT }]}>
            {values.map((v, i) => {
              const clamped = Math.min(1, Math.max(0, v));
              const h = Math.max(MIN_BAR_HEIGHT, clamped * PLOT_HEIGHT);
              const isActive = i === activeIndex;
              const bar = (
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
              );
              return (
                <View key={i} style={styles.barSlot}>
                  {onBarPress ? (
                    <Pressable
                      onPress={() => onBarPress(i)}
                      style={({ pressed }) => [styles.barPress, pressed && styles.barPressed]}>
                      {bar}
                    </Pressable>
                  ) : (
                    bar
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
      {(startLabel || endLabel) && (
        <View style={[styles.xAxis, { marginLeft: Y_AXIS_WIDTH + Spacing.two }]}>
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
      <View
        style={[
          styles.markerLine,
          { backgroundColor: theme.textSecondary, marginLeft: Y_AXIS_WIDTH + Spacing.two },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  yAxisTitle: {
    marginBottom: Spacing.one,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
  },
  yAxisLabels: {
    width: Y_AXIS_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 2,
  },
  yTick: {
    fontSize: 11,
    lineHeight: 14,
  },
  plotWrap: {
    flex: 1,
    position: 'relative',
  },
  gridLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    opacity: 0.25,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    zIndex: 1,
  },
  barSlot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  barPress: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: PLOT_HEIGHT,
  },
  barPressed: {
    opacity: 0.85,
  },
  bar: {
    borderRadius: 2,
    width: '100%',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerLine: {
    height: 1,
    opacity: 0.35,
    marginTop: Spacing.one,
  },
});
