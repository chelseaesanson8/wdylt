/**
 * <RedBarHeader>: the big black block at the top of a screen, with the
 * vermilion bar down its right side and a red rule along the bottom.
 *
 *   <RedBarHeader
 *     count="47"
 *     title="books high"
 *     note="one per page"
 *     sideLabel="In a row"
 *     seal
 *   />
 *
 * Every prop is optional, so it also works as a plain header with just a
 * title. Anything you put inside it (children) goes under the title.
 */
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";
import { Seal } from "./Seal";
import { Text } from "./Text";
import { Wordmark } from "./Wordmark";

type Props = {
  /** Show the wdylt wordmark at the top. */
  logo?: boolean;
  /** Small capitals above everything, like "DAY" or "FROM YOUR PAGES". */
  eyebrow?: string;
  /** The big number, like "47". */
  count?: string;
  title?: string;
  /** Quieter text under the title. */
  subtitle?: string;
  /** Small text on the right, level with the title, like "one per page". */
  note?: string;
  /** Text running down the red bar, like "IN A ROW". */
  sideLabel?: string;
  /** Press an off-white seal into the block, top right. */
  seal?: boolean;
  children?: ReactNode;
};

const BAR = 18; // width of the red side bar
const GUTTER = 24; // left/right page margin, same as the mockups

export function RedBarHeader({ logo = true, eyebrow, count, title, subtitle, note, sideLabel, seal, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.block,
          paddingTop: insets.top + 12,
          paddingBottom: 22,
          paddingLeft: GUTTER,
          // Leave room on the right for the red bar (and the seal, if shown).
          paddingRight: GUTTER + BAR + 16 + (seal ? 96 : 0),
        }}
      >
        {logo && <Wordmark height={24} color={colors.onBlock} />}

        {eyebrow && (
          <Text variant="label" tone="onBlockSoft" style={{ marginTop: logo ? 28 : 8 }}>
            {eyebrow}
          </Text>
        )}

        {count && (
          <Text variant="count" tone="onBlock" style={{ marginLeft: -6, marginTop: 6 }}>
            {count}
          </Text>
        )}

        {(title || note) && (
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            {title ? (
              <Text variant={count ? "heading" : "title"} tone="onBlock" style={{ flexShrink: 1 }}>
                {title}
              </Text>
            ) : (
              <View />
            )}
            {note && (
              <Text variant="small" tone="onBlockSoft">
                {note}
              </Text>
            )}
          </View>
        )}

        {subtitle && (
          <Text variant="small" tone="onBlockSoft" style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
        )}

        {children}

        {seal && (
          // The seal, off-white, pressed into the black block beside the number.
          <View
            style={{ position: "absolute", top: insets.top + 48, right: GUTTER + BAR + 14 }}
            pointerEvents="none"
          >
            <Seal size={88} seed={3} rotate={-8} color={colors.onBlock} />
          </View>
        )}

        {/* The red bar down the right side. */}
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: GUTTER - 4,
            width: BAR,
            backgroundColor: colors.verm,
            alignItems: "center",
          }}
        >
          {sideLabel && (
            // Turned on its side to read top to bottom. A rotated Text keeps its
            // un-rotated size for layout, so it gets a fixed width and is
            // centred on the bar.
            <Text
              variant="label"
              tone="onBlock"
              numberOfLines={1}
              style={{
                position: "absolute",
                top: insets.top + 90,
                width: 200,
                textAlign: "center",
                transform: [{ rotate: "90deg" }],
              }}
            >
              {sideLabel}
            </Text>
          )}
        </View>
      </View>

      {/* The red rule along the bottom. */}
      <View style={{ height: 7, backgroundColor: colors.verm }} />
    </View>
  );
}
