/**
 * <Wordmark>: the "wdylt." logo. Letters take `color` (ink by default),
 * the full stop is always vermilion.
 *
 *   <Wordmark height={30} />                         on paper
 *   <Wordmark height={30} color={colors.onBlock} />  on a black block
 */
import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/theme";
import { WORDMARK } from "./logo-paths";

export function Wordmark({ height = 28, color }: { height?: number; color?: string }) {
  const { colors } = useTheme();
  const width = (height * WORDMARK.width) / WORDMARK.height;

  return (
    <Svg width={width} height={height} viewBox={WORDMARK.viewBox} accessibilityLabel="wdylt">
      <Path d={WORDMARK.letters} fill={color ?? colors.ink} />
      <Path d={WORDMARK.stop} fill={colors.verm} />
    </Svg>
  );
}
