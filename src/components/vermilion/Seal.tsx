/**
 * <Seal>: the WDYLT stamp. A square (or round) border with the "w." mark
 * inside, slightly tilted, with a few gaps in the ink like a real rubber stamp.
 *
 *   <Seal size={54} />                         red, square, tilted at random
 *   <Seal size={96} shape="circle" seed={3} />
 *   <Seal size={110} color={colors.onBlock} />   off-white, for the black hero
 *
 * `seed` decides the tilt and the ink gaps. Give each stamp on a screen its
 * own seed (the day of the month works well) so they don't all look the same.
 */
import { useId } from "react";
import Svg, { Circle, Defs, G, Mask, Path, Rect } from "react-native-svg";

import { useTheme } from "@/theme";
import { MARK } from "./logo-paths";
import { between, seededRandom } from "./random";

type Props = {
  /** Width and height in points. */
  size?: number;
  shape?: "square" | "circle";
  /** Ink colour. Defaults to vermilion. */
  color?: string;
  /** Tilt in degrees. Defaults to a random tilt from the seed (-9 to 9). */
  rotate?: number;
  seed?: number;
  /** How worn the ink looks, 0 (clean) to 1 (very patchy). */
  wear?: number;
};

// The stamp is drawn in a 100 x 100 box. The extra space around it in the
// viewBox stops the corners being cut off when it's tilted.
const PAD = 9;
const BORDER = 7.5;

export function Seal({ size = 56, shape = "square", color, rotate, seed = 1, wear = 0.5 }: Props) {
  const { colors } = useTheme();
  const ink = color ?? colors.verm;
  const maskId = "seal" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const rand = seededRandom(seed);
  const tilt = rotate ?? between(rand, -9, 9);

  // Little gaps where the stamp didn't pick up ink.
  const gaps = Array.from({ length: Math.round(10 + wear * 50) }, () => ({
    x: between(rand, 0, 100),
    y: between(rand, 0, 100),
    r: between(rand, 0.4, 0.8 + wear * 1.6),
  }));

  // Fit the "w." mark into the middle 70% of the box, same as the mockups.
  const markScale = 70 / MARK.width;
  const markX = 15 - MARK.minX * markScale;
  const markY = (100 - MARK.height * markScale) / 2 + 2 - MARK.minY * markScale;

  return (
    <Svg width={size} height={size} viewBox={`${-PAD} ${-PAD} ${100 + PAD * 2} ${100 + PAD * 2}`}>
      <Defs>
        <Mask id={maskId} x={-PAD} y={-PAD} width={100 + PAD * 2} height={100 + PAD * 2} maskUnits="userSpaceOnUse">
          <Rect x={-PAD} y={-PAD} width={100 + PAD * 2} height={100 + PAD * 2} fill="white" />
          {gaps.map((g, i) => (
            <Circle key={i} cx={g.x} cy={g.y} r={g.r} fill="black" />
          ))}
        </Mask>
      </Defs>
      <G rotation={tilt} origin="50, 50" mask={`url(#${maskId})`} opacity={0.93}>
        {shape === "circle" ? (
          <Circle cx={50} cy={50} r={50 - BORDER / 2} stroke={ink} strokeWidth={BORDER} fill="none" />
        ) : (
          <Rect
            x={BORDER / 2}
            y={BORDER / 2}
            width={100 - BORDER}
            height={100 - BORDER}
            rx={12}
            stroke={ink}
            strokeWidth={BORDER}
            fill="none"
          />
        )}
        <G transform={`translate(${markX} ${markY}) scale(${markScale})`}>
          <Path d={MARK.letters} fill={ink} />
          <Path d={MARK.stop} fill={ink} />
        </G>
      </G>
    </Svg>
  );
}
