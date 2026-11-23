/**
 * <SquaredPaper>: the writing area. Rows of thin red squares, like Japanese
 * manuscript paper, with the day's entry sitting one line per row.
 *
 *   <SquaredPaper rows={3} />                                  empty
 *   <SquaredPaper text="Planted garlic. It needs a cold..." />  with writing
 *   <SquaredPaper rowGap={0} cell={44} />                      one solid grid (landing page style)
 *
 * It measures its own width and fits as many squares as will go across.
 * With `text`, it adds rows as the text gets longer.
 */
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { fonts, useTheme, type ColorName } from "@/theme";
import { Text } from "./Text";

type Props = {
  /** Fewest rows to draw (more are added if the text needs them). */
  rows?: number;
  /** Size of one square in points. */
  cell?: number;
  /** Space between rows. 0 makes one continuous grid. */
  rowGap?: number;
  /** The entry to write on the squares. */
  text?: string;
  /** Text colour, from the palette. */
  tone?: ColorName;
  /** Line colour. Defaults to the palette's see-through red. */
  lineColor?: string;
};

export function SquaredPaper({ rows = 3, cell = 38, rowGap = 8, text, tone = "ink", lineColor }: Props) {
  const { colors } = useTheme();
  const line = lineColor ?? colors.grid;
  const [width, setWidth] = useState(0);
  const [textRows, setTextRows] = useState(0);

  const cols = Math.max(1, Math.floor(width / cell));
  const rowCount = Math.max(rows, textRows);
  const lineHeight = cell + rowGap;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 &&
        Array.from({ length: rowCount }, (_, r) => (
          <View
            key={r}
            style={{
              flexDirection: "row",
              width: cols * cell,
              height: cell,
              marginTop: r === 0 ? 0 : rowGap,
              // With no gap, rows share their top/bottom line instead of doubling it.
              borderTopWidth: rowGap === 0 && r > 0 ? 0 : 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderColor: line,
            }}
          >
            {Array.from({ length: cols }, (_, c) => (
              <View key={c} style={{ width: cell, borderRightWidth: 1, borderColor: line }} />
            ))}
          </View>
        ))}

      {text ? (
        <Text
          tone={tone}
          // One line of text per row of squares. The text is shifted up by half
          // a gap so each line sits in the middle of its row.
          style={{
            position: "absolute",
            top: -rowGap / 2,
            left: 8,
            width: Math.max(0, cols * cell - 16),
            fontFamily: fonts.gothic,
            fontSize: Math.round(cell * 0.5),
            lineHeight,
          }}
          onTextLayout={(e) => setTextRows(e.nativeEvent.lines.length)}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );
}
