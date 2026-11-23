/**
 * <Button>: square-cornered, full-width by default.
 *
 *   <Button label="Open today's page" onPress={...} />            black block, red mark
 *   <Button label="Add a note" variant="outline" onPress={...} />  outlined
 *   <Button label="Stamp the day" variant="red" onPress={...} />   vermilion
 */
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme";
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
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: 54,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: background,
        borderWidth: variant === "outline" ? 1.4 : 0,
        borderColor: colors.ink,
        opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
      })}
    >
      {showMark && <View style={{ width: 10, height: 10, backgroundColor: colors.verm }} />}
      <Text variant="button" tone={textTone}>
        {label}
      </Text>
    </Pressable>
  );
}
