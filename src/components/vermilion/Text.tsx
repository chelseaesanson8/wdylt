/**
 * <Text> with the WDYLT type scale built in.
 *
 *   <Text variant="title">What did you learn today?</Text>
 *   <Text variant="label" tone="muted">Yesterday · 22 Nov</Text>
 *   <Text variant="count" tone="onBlock">47</Text>
 *
 * `variant` picks font, size and spacing from tokens.js.
 * `tone` picks a colour from the current palette (default: ink).
 * You can still add NativeWind classes with className for spacing and layout
 * (like "mt-2"), but set colour and size with tone and variant, because those
 * win over classes.
 */
import { Text as RNText, type TextProps } from "react-native";

import { fonts, type, useTheme, type ColorName, type TypeVariant } from "@/theme";

type Props = TextProps & {
  variant?: TypeVariant;
  tone?: ColorName;
  className?: string;
};

export function Text({ variant = "body", tone = "ink", style, children, ...rest }: Props) {
  const { colors } = useTheme();
  const t = type[variant];

  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: fonts[t.font],
          fontSize: t.size,
          lineHeight: t.lineHeight,
          letterSpacing: t.tracking ?? 0,
          textTransform: t.upper ? "uppercase" : "none",
          color: colors[tone],
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
