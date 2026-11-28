/**
 * The streak, shown as books lying flat in a stack: one book per stamped page.
 * Today's book is on top, in vermilion.
 *
 * A missed day is a "ghost book": an empty, dashed outline in the pile where
 * that day's book would be. The stack keeps growing, so its height always
 * matches the number of days.
 *
 *   <Streak days={days} todayNote="sourdough" />   the stack on its shelf
 *   <BookStack days={stamped(47)} milestones />   just the stack, no shelf
 *
 * `days` is a list, oldest first, of "stamped" or "missed". `stamped(47)` is
 * a shortcut for 47 stamped days in a row.
 *
 * Book sizes and colours come from `seed`, so the same streak always looks
 * the same. Each book gets its own seed from its place in the pile, so
 * adding today's book never reshuffles the books under it.
 *
 * When a day is added, its book drops onto the pile from just above and
 * settles without bouncing. Taking it away lifts it back out the same way.
 * With Reduce Motion on, it fades in and out instead.
 */
import { View } from "react-native";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

import { fonts, space, useTheme, type Palette } from "@/theme";
import { dropIn, fadeIn, fadeOut, liftOut } from "@/theme/motion";
import { between, seededRandom } from "./random";
import { Text } from "./Text";

export type Day = "stamped" | "missed";

/** Shortcut: `n` stamped days in a row. */
export function stamped(n: number): Day[] {
  return Array.from({ length: n }, () => "stamped");
}

type Book = {
  day: Day;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  band?: { x: number; color: string };
};

const GAP = 0.7; // space between books
const ANNOTATION = 120; // room on the right for "TODAY" and milestone numbers

/** Works out where every book goes. Pure maths, no drawing. */
function layoutBooks(
  days: Day[],
  seed: number,
  [wMin, wMax]: [number, number],
  [hMin, hMax]: [number, number],
  current: boolean,
  colors: Palette,
  holds = 0,
) {
  // Mostly dark books, some light, one tan, the odd red one. Same mix as the mockups.
  const palette = [
    colors.bookA,
    colors.bookA,
    colors.bookA,
    colors.bookA,
    colors.bookB,
    colors.bookB,
    colors.bookB,
    colors.bookC,
    colors.verm,
  ];
  const bandFor = (c: string) =>
    c === colors.bookA ? colors.verm : c === colors.verm ? colors.bookA : c === colors.bookB ? colors.bookA : colors.bookB;
  const wobble = (wMax - wMin) * 0.12;

  // Every random choice for book i comes from book i's own seed.
  const picks = Array.from({ length: Math.max(days.length, holds) }, (_, i) => {
    const rand = seededRandom(seed * 7919 + i * 104729 + 1);
    return {
      w: between(rand, wMin, wMax),
      h: between(rand, hMin, hMax),
      nudge: between(rand, -wobble, wobble),
      colour: rand(),
      band: rand(),
      bandAt: rand(),
    };
  });
  const pileHeight = picks.slice(0, days.length).reduce((sum, p) => sum + p.h + GAP, 0);
  // With `holds`, the box is as tall as that many books, and the pile sits at its bottom.
  const height = Math.max(
    pileHeight,
    picks.reduce((sum, p) => sum + p.h + GAP, 0),
  );

  const books: Book[] = [];
  let y = height; // build from the bottom up
  let last = "";
  days.forEach((day, i) => {
    const { w, h, nudge, colour, band, bandAt } = picks[i];
    const isTop = i === days.length - 1;
    y -= h + GAP;
    const x = (wMax - w) / 2 + nudge + wobble;
    if (day === "missed") {
      books.push({ day, x, y, w, h, color: "transparent" });
      return;
    }
    const choices = palette.filter((c) => c !== last);
    let color = choices[Math.floor(colour * choices.length)];
    last = color;
    // Today's book is always red, on top.
    if (isTop && current) color = colors.verm;
    // About half the books get a coloured band near one end of the spine.
    const hasBand = h >= 5 && band < 0.55;
    const bandX = w * [0.08, 0.14, 0.8, 0.86][Math.floor(bandAt * 4)];
    books.push({ day, x, y, w, h, color, band: hasBand ? { x: bandX, color: bandFor(color) } : undefined });
  });
  return { books, height, width: wMax + wobble * 2 };
}

/** A missed day: the ghost book. Same size as a real book, dashed outline, no fill. */
function GhostBook({ book, colors }: { book: Book; colors: Palette }) {
  const stroke = 1.4;
  return (
    <Svg width={book.w} height={book.h}>
      <Rect
        x={stroke / 2}
        y={stroke / 2}
        width={book.w - stroke}
        height={book.h - stroke}
        fill="none"
        stroke={colors.muted}
        strokeWidth={stroke}
        strokeDasharray="5 3"
      />
    </Svg>
  );
}

type BookStackProps = {
  /** Oldest first. Use stamped(n) for n days in a row. */
  days: Day[];
  seed?: number;
  /** Narrowest and widest book, in points. */
  bookWidth?: [number, number];
  /** Thinnest and thickest book, in points. */
  bookHeight?: [number, number];
  /** Has today been stamped? Then the top book is today's, in red, with the "Today" note. */
  current?: boolean;
  /** Text next to today's book, like the subject of today's entry. */
  todayNote?: string;
  /** Mark every 10th book with its number. */
  milestones?: boolean;
  /** Keep room for this many books, so the pile can grow up without moving the shelf. */
  holds?: number;
};

/** The pile of books. Missed days are ghost books. */
export function BookStack({
  days,
  seed = 21,
  bookWidth = [150, 190],
  bookHeight = [7.2, 9],
  current = true,
  todayNote,
  milestones,
  holds,
}: BookStackProps) {
  const { colors, a11y } = useTheme();
  const reduce = a11y.reduceMotion;
  const { books, height, width } = layoutBooks(days, seed, bookWidth, bookHeight, current, colors, holds);
  const topIndex = books.length - 1;
  const top = books[topIndex];
  const showToday = current && top?.day === "stamped" && todayNote !== undefined;
  const annotate = todayNote !== undefined || milestones;

  return (
    // Books already there when the screen opens don't animate; only new ones do.
    <LayoutAnimationConfig skipEntering>
      <View style={{ width: width + (annotate ? ANNOTATION : 0), height }}>
        {books.map((b, i) => (
          <Animated.View
            key={i}
            entering={dropIn(reduce)}
            exiting={liftOut(reduce)}
            style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}
          >
            {b.day === "missed" ? (
              <GhostBook book={b} colors={colors} />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: b.color,
                  // Light books get a thin outline so they don't vanish into the paper.
                  borderWidth: b.color === colors.bookB ? 1 : 0,
                  borderColor: colors.bookEdge,
                }}
              >
                {b.band && (
                  <View
                    style={{
                      position: "absolute",
                      left: b.band.x,
                      top: 0,
                      bottom: 0,
                      width: Math.max(3, b.w * 0.03),
                      backgroundColor: b.band.color,
                    }}
                  />
                )}
              </View>
            )}
          </Animated.View>
        ))}

        {showToday && (
          // Keyed by the top book, so the note fades across when a new day lands.
          <Animated.View
            key={`today${topIndex}`}
            entering={fadeIn()}
            exiting={fadeOut()}
            style={{
              position: "absolute",
              left: top.x + top.w + space.s1,
              top: top.y + top.h / 2 - space.s1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{ width: Math.max(space.s1, width - top.x - top.w), height: 1.4, backgroundColor: colors.verm, marginRight: space.s1 }}
            />
            <View>
              <Text variant="label" tone="vermText">
                Today
              </Text>
              {todayNote ? (
                <Text variant="small" numberOfLines={1}>
                  {todayNote}
                </Text>
              ) : null}
            </View>
          </Animated.View>
        )}

        {milestones &&
          books.map((b, i) =>
            (i + 1) % 10 === 0 && !(showToday && i === topIndex) ? (
              <View
                key={`m${i}`}
                style={{
                  position: "absolute",
                  left: b.x + b.w + space.s1,
                  top: b.y + b.h / 2 - 9,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ width: width + 56 - b.x - b.w, height: 1, backgroundColor: colors.rule, marginRight: 6 }} />
                <Text variant="small" tone="muted" style={{ fontFamily: fonts.number, lineHeight: 18 }}>
                  {i + 1}
                </Text>
              </View>
            ) : null,
          )}

        {annotate &&
          books.map((b, i) =>
            b.day === "missed" ? (
              <View
                key={`g${i}`}
                style={{
                  position: "absolute",
                  left: b.x + b.w + space.s1,
                  top: b.y + b.h / 2 - 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ width: Math.max(space.s1, width - b.x - b.w), height: 1, backgroundColor: colors.rule, marginRight: space.s1 }}
                />
                <Text variant="small" tone="muted">
                  blank page
                </Text>
              </View>
            ) : null,
          )}
      </View>
    </LayoutAnimationConfig>
  );
}

/**
 * The streak on its shelf.
 *
 * `holds` keeps room above the pile for that many books in total, so when
 * today's book lands the pile grows upward and the shelf stays put. Without
 * it, everything below the streak would jump down by one book.
 */
export function Streak({
  days,
  todayNote,
  milestones,
  bookHeight,
  current,
  holds,
  seed = 7,
}: {
  days: Day[];
  todayNote?: string;
  milestones?: boolean;
  /** Thinnest and thickest book. Thicker books suit a short streak. */
  bookHeight?: [number, number];
  /** Has today been stamped? Defaults to yes. */
  current?: boolean;
  /** Keep room for this many books (see above). */
  holds?: number;
  seed?: number;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <BookStack
        days={days}
        seed={seed}
        bookHeight={bookHeight}
        todayNote={todayNote}
        milestones={milestones}
        current={current}
        holds={holds}
      />
      {/* The shelf itself. */}
      <View style={{ height: 5, backgroundColor: colors.ink, marginTop: 2 }} />
    </View>
  );
}
