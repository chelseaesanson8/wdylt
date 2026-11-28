/**
 * <StampCard>: the month view. One square per day, Monday first, with a
 * seal on every day that has a stamped page. Today gets a heavy outline,
 * and if today isn't stamped yet, a dashed red circle shows where it'll go.
 *
 *   <StampCard year={2026} month={11} stamped={[1, 2, 3, 5, 6]} today={23} />
 *
 * `month` is 1 to 12 (November is 11), not JavaScript's 0 to 11.
 * The card measures its width and sizes the squares to fit.
 *
 * When today gets stamped, its seal presses onto the square (a touch big and
 * tilted, then flat) and lifts off the same way if it's undone. Seals already
 * there when the screen opens don't animate.
 */
import { useState } from "react";
import { View } from "react-native";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";

import { space, useTheme } from "@/theme";
import { stampIn, stampOut } from "@/theme/motion";
import { Seal } from "./Seal";
import { Text } from "./Text";

type Props = {
  year: number;
  /** 1 = January ... 12 = December. */
  month: number;
  /** Days of the month that have a stamped page. */
  stamped: number[];
  /** Today's day of the month, if today is in this month. */
  today?: number;
};

const COLUMN_GAP = space.s1;
const ROW_GAP = space.s1;
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StampCard({ year, month, stamped, today }: Props) {
  const { colors, a11y } = useTheme();
  const [width, setWidth] = useState(0);

  const cell = Math.floor((width - COLUMN_GAP * 6) / 7);
  const daysInMonth = new Date(year, month, 0).getDate();
  // getDay() says Sunday = 0. Shift it so Monday = 0.
  const firstColumn = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const stampedSet = new Set(stamped);

  // Empty squares before the 1st, then 1, 2, 3... split into weeks.
  const slots: (number | null)[] = [...Array(firstColumn).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (slots.length % 7) slots.push(null);
  const weeks = Array.from({ length: slots.length / 7 }, (_, w) => slots.slice(w * 7, w * 7 + 7));

  return (
    <LayoutAnimationConfig skipEntering>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {cell > 0 && (
          <>
            <View style={{ flexDirection: "row", gap: COLUMN_GAP, marginBottom: space.s1 }}>
              {WEEKDAYS.map((d, i) => (
                <Text key={i} variant="label" tone="muted" style={{ width: cell, textAlign: "center", fontSize: 10 }}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={{ gap: ROW_GAP }}>
              {weeks.map((week, w) => (
                <View key={w} style={{ flexDirection: "row", gap: COLUMN_GAP }}>
                  {week.map((day, i) => {
                    if (day === null) return <View key={i} style={{ width: cell, height: cell }} />;
                    const isStamped = stampedSet.has(day);
                    const isToday = day === today;
                    return (
                      <View
                        key={i}
                        style={{
                          width: cell,
                          height: cell,
                          borderWidth: isToday ? 2 : 1,
                          borderColor: isToday ? colors.ink : isStamped ? colors.rule : colors.rule + "99",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          variant="label"
                          tone="muted"
                          style={{ position: "absolute", top: 2, left: 4, fontSize: 9, lineHeight: 12, letterSpacing: 0 }}
                        >
                          {day}
                        </Text>
                        {isStamped ? (
                          <Animated.View
                            key="seal"
                            entering={stampIn(a11y.reduceMotion)}
                            exiting={stampOut(a11y.reduceMotion)}
                            style={{ marginTop: 4, marginLeft: 3 }}
                          >
                            <Seal size={cell * 0.8} shape="circle" seed={day * 3 + 1} />
                          </Animated.View>
                        ) : isToday ? (
                          // Where today's stamp will go.
                          <View
                            style={{
                              width: cell * 0.56,
                              height: cell * 0.56,
                              marginTop: 4,
                              borderRadius: cell,
                              borderWidth: 1.4,
                              borderStyle: "dashed",
                              borderColor: colors.verm,
                            }}
                          />
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </LayoutAnimationConfig>
  );
}
