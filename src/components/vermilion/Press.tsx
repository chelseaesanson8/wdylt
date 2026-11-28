/**
 * <Press>: anything you can tap. It sinks slightly (to 97%) the instant your
 * finger lands, not when you let go, and springs back on release. That's the
 * first rule of the Apple guide: respond on touch-down.
 *
 *   <Press onPress={...} accessibilityLabel="Paper">...</Press>
 *
 * Details that make it feel right:
 *   - The sink is a quick 100 ms ease; the release is a no-bounce spring, so
 *     a fast tap that's let go halfway down just turns around smoothly.
 *   - 10 points of extra touch area around it (hitSlop).
 *   - Slide your finger off and it springs back without firing.
 *   - With Reduce Motion on, it dims a little instead of shrinking.
 *   - `disabled` greys it out and stops it responding.
 *
 * <Button> is built on this. Use it for any other tappable thing too, so
 * everything in the app answers a touch the same way.
 */
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { motion, useTheme } from "@/theme";
import { pressIn, spring } from "@/theme/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const RELEASE = spring("settle");
const SINK = 1 - motion.press.scale;

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
};

export function Press({ style, onPressIn, onPressOut, hitSlop = 10, disabled, children, ...rest }: Props) {
  const { a11y } = useTheme();
  const reduce = a11y.reduceMotion;
  const down = useSharedValue(0); // 0 = resting, 1 = fully pressed

  const restOpacity = disabled ? 0.4 : 1;

  const pressedStyle = useAnimatedStyle(
    () =>
      reduce
        ? { opacity: restOpacity * (1 - 0.18 * down.value), transform: [{ scale: 1 }] }
        : { opacity: restOpacity, transform: [{ scale: 1 - SINK * down.value }] },
    [reduce, restOpacity],
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={(e) => {
        down.value = withTiming(1, pressIn);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        down.value = withSpring(0, RELEASE);
        onPressOut?.(e);
      }}
      style={[style, pressedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
