/**
 * <Perforation>: a dashed line, like the tear-off edge of a notebook page.
 * Use it between list items instead of a solid divider.
 */
import Svg, { Line } from "react-native-svg";

import { useTheme } from "@/theme";

export function Perforation({ color }: { color?: string }) {
  const { colors } = useTheme();
  return (
    <Svg width="100%" height={2}>
      <Line x1="0" y1="1" x2="100%" y2="1" stroke={color ?? colors.rule} strokeWidth={1.4} strokeDasharray="4 4" />
    </Svg>
  );
}
