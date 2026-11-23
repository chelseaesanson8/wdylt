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
 * the same.
 */
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";

import { fonts, useTheme, type Palette } from "@/theme";
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
) {
  const rand = seededRandom(seed);
  // Mostly dark books, some light, one tan, the odd red one. Same mix as the mockups.
  const palette = [colors.bookA, colors.bookA, colors.bookA, colors.bookA, colors.bookB, colors.bookB, colors.bookB, colors.bookC, colors.verm];
  const bandFor = (c: string) => (c === colors.bookA ? colors.verm : c === colors.verm ? colors.bookA : c === colors.bookB ? colors.bookA : colors.bookB);
  const wobble = (wMax - wMin) * 0.12;

  const sizes = days.map(() => ({ w: between(rand, wMin, wMax), h: between(rand, hMin, hMax) }));
  const height = sizes.reduce((sum, s) => sum + s.h + GAP, 0);

  const books: Book[] = [];
  let y = height; // build from the bottom up
  let last = "";
  days.forEach((day, i) => {
    const { w, h } = sizes[i];
    const isTop = i === days.length - 1;
    y -= h + GAP;
    const x = (wMax - w) / 2 + between(rand, -wobble, wobble) + wobble;
    const choices = palette.filter((c) => c !== last && (!isTop || !current || c !== colors.verm));
    let color = choices[Math.floor(rand() * choices.length)];
    if (isTop && current && day === "stamped") color = colors.verm;
    // About half the books get a coloured band near one end of the spine.
    const hasBand = h >= 5 && rand() < 0.55;
    const bandX = w * [0.08, 0.14, 0.8, 0.86][Math.floor(rand() * 4)];
    if (day === "missed") {
      books.push({ day, x, y, w, h, color: "transparent" });
      return;
    }
    last = color;
    books.push({ day, x, y, w, h, color, band: hasBand ? { x: bandX, color: bandFor(color) } : undefined });
  });
  return { books, height, width: wMax + wobble * 2 };
}

/** A missed day: the ghost book. Same size as a real book, dashed outline, no fill. */
function GhostBook({ book, colors }: { book: Book; colors: Palette }) {
  const stroke = 1.4;
  return (
    <Svg width={book.w} height={book.h} style={{ position: "absolute", left: book.x, top: book.y }}>
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
  /** Is this the streak that's still going? Its top book is today's, in red. */
  current?: boolean;
  /** Text next to today's book, like the subject of today's entry. */
  todayNote?: string;
  /** Mark every 10th book with its number. */
  milestones?: boolean;
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
}: BookStackProps) {
  const { colors } = useTheme();
  const { books, height, width } = layoutBooks(days, seed, bookWidth, bookHeight, current, colors);
  const top = books[books.length - 1];
  const showToday = current && top?.day === "stamped" && todayNote !== undefined;
  const annotate = current && (todayNote !== undefined || milestones);

  return (
    <View style={{ width: width + (annotate ? ANNOTATION : 0), height }}>
      {books.map((b, i) =>
        b.day === "missed" ? (
          <GhostBook key={i} book={b} colors={colors} />
        ) : (
          <View
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              backgroundColor: b.color,
              // Light books get a thin outline so they don't vanish into the paper.
              borderWidth: b.color === colors.bookB ? 1 : 0,
              borderColor: colors.bookEdge,
            }}
          >
            {b.band && (
              <View style={{ position: "absolute", left: b.band.x, top: 0, bottom: 0, width: Math.max(3, b.w * 0.03), backgroundColor: b.band.color }} />
            )}
          </View>
        ),
      )}

      {showToday && (
        <View style={{ position: "absolute", left: top.x + top.w + 8, top: top.y + top.h / 2 - 8, flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: Math.max(8, width - top.x - top.w), height: 1.4, backgroundColor: colors.verm, marginRight: 8 }} />
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
        </View>
      )}

      {current &&
        milestones &&
        books.map((b, i) =>
          (i + 1) % 10 === 0 && i < books.length - 1 ? (
            <View key={`m${i}`} style={{ position: "absolute", left: b.x + b.w + 8, top: b.y + b.h / 2 - 9, flexDirection: "row", alignItems: "center" }}>
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
            <View key={`g${i}`} style={{ position: "absolute", left: b.x + b.w + 8, top: b.y + b.h / 2 - 10, flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: Math.max(8, width - b.x - b.w), height: 1, backgroundColor: colors.rule, marginRight: 8 }} />
              <Text variant="small" tone="muted">
                blank page
              </Text>
            </View>
          ) : null,
        )}
    </View>
  );
}

/** The streak on its shelf. */
export function Streak({
  days,
  todayNote,
  milestones,
  bookHeight,
  seed = 7,
}: {
  days: Day[];
  todayNote?: string;
  milestones?: boolean;
  /** Thinnest and thickest book. Thicker books suit a short streak. */
  bookHeight?: [number, number];
  seed?: number;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <BookStack days={days} seed={seed} bookHeight={bookHeight} todayNote={todayNote} milestones={milestones} />
      {/* The shelf itself. */}
      <View style={{ height: 5, backgroundColor: colors.ink, marginTop: 2 }} />
    </View>
  );
}
