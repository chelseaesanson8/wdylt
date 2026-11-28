/**
 * <Button>: square-cornered, full-width by default.
 *
 *   <Button label="Open today's page" onPress={...} />            black block, red mark
 *   <Button label="Add a note" variant="outline" onPress={...} />  outlined
 *   <Button label="Stamp the day" variant="red" onPress={...} />   vermilion
 *
 * It sinks the moment it's touched and springs back on release (see Press).
 */
import { View } from "react-native";

import { space, useTheme } from "@/theme";
import { Press } from "./Press";
import { Text } from "./Text";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "solid" | "outline" | "red";
  /** The small red square before the label. On by default for solid buttons. */
  mark?: boolean;
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "solid", mark, disabled }: Props) {
  const { colors } = useTheme();
  const showMark = mark ?? variant === "solid";
  const background = variant === "solid" ? colors.block : variant === "red" ? colors.verm : "transparent";
  const textTone = variant === "outline" ? "ink" : "onBlock";

  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={{
        minHeight: 56,
        paddingHorizontal: space.s3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space.s2,
        backgroundColor: background,
        borderWidth: variant === "outline" ? 1.5 : 0,
        borderColor: colors.ink,
      }}
    >
      {showMark && <View style={{ width: 10, height: 10, backgroundColor: variant === "red" ? colors.block : colors.verm }} />}
      <Text variant="button" tone={textTone}>
        {label}
      </Text>
    </Press>
  );
}
