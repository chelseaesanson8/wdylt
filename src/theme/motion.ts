/**
 * Motion helpers, built on Reanimated.
 *
 * The Apple design guide in short: things respond the instant you touch
 * them, move on springs (so they can be interrupted and sent back halfway),
 * settle without bouncing unless you threw them, and simply fade when the
 * phone's Reduce Motion setting is on.
 *
 *   const s = spring("settle");         // { mass, stiffness, damping } for withSpring
 *   offset.value = withSpring(0, s);
 *
 * Springs in tokens.js use Apple's two numbers (damping and response).
 * Reanimated wants physics numbers, so spring() converts them:
 *   stiffness = (2π / response)²   damping = 4π × dampingRatio / response
 */
import {
  Easing,
  ReduceMotion,
  withSpring,
  withTiming,
  type EntryExitAnimationFunction,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

import { motion } from "@/theme";

type SpringName = "settle" | "flick";

export function spring(name: SpringName = "settle", velocity = 0): WithSpringConfig {
  const { damping, response } = motion[name];
  return {
    mass: 1,
    stiffness: Math.pow((2 * Math.PI) / response, 2),
    damping: (4 * Math.PI * damping) / response,
    velocity,
    // We handle Reduce Motion ourselves (a fade instead), so Reanimated
    // shouldn't also skip the animation.
    reduceMotion: ReduceMotion.Never,
  };
}

/** How fast a pressed thing sinks: quick and eased, so it feels instant. */
export const pressIn: WithTimingConfig = {
  duration: motion.press.ms,
  easing: Easing.out(Easing.quad),
  reduceMotion: ReduceMotion.Never,
};

/** The gentle fade used instead of movement when Reduce Motion is on. */
export const fade: WithTimingConfig = {
  duration: motion.fadeMs,
  easing: Easing.inOut(Easing.quad),
  reduceMotion: ReduceMotion.Never,
};

/**
 * Arrive and leave along the same path (the guide's "spatial consistency"):
 * something that drops in from above lifts back out the same way.
 * With Reduce Motion on, both become a plain fade.
 *
 *   <Animated.View entering={dropIn(reduce)} exiting={liftOut(reduce)} />
 */
const SETTLE = spring("settle");
const FADE = fade;

export function dropIn(reduce: boolean, distance = 24): EntryExitAnimationFunction {
  return () => {
    "worklet";
    if (reduce) return { initialValues: { opacity: 0 }, animations: { opacity: withTiming(1, FADE) } };
    return {
      initialValues: { opacity: 0, transform: [{ translateY: -distance }] },
      animations: { opacity: withSpring(1, SETTLE), transform: [{ translateY: withSpring(0, SETTLE) }] },
    };
  };
}

export function liftOut(reduce: boolean, distance = 24): EntryExitAnimationFunction {
  return () => {
    "worklet";
    if (reduce) return { initialValues: { opacity: 1 }, animations: { opacity: withTiming(0, FADE) } };
    return {
      initialValues: { opacity: 1, transform: [{ translateY: 0 }] },
      animations: { opacity: withSpring(0, SETTLE), transform: [{ translateY: withSpring(-distance, SETTLE) }] },
    };
  };
}

/** A seal pressed onto the page: from a touch larger and tilted, down flat. Lifts off the same way. */
export function stampIn(reduce: boolean): EntryExitAnimationFunction {
  return () => {
    "worklet";
    if (reduce) return { initialValues: { opacity: 0 }, animations: { opacity: withTiming(1, FADE) } };
    return {
      initialValues: { opacity: 0, transform: [{ scale: 1.12 }, { rotate: "-4deg" }] },
      animations: {
        opacity: withSpring(1, SETTLE),
        transform: [{ scale: withSpring(1, SETTLE) }, { rotate: withSpring("0deg", SETTLE) }],
      },
    };
  };
}

export function stampOut(reduce: boolean): EntryExitAnimationFunction {
  return () => {
    "worklet";
    if (reduce) return { initialValues: { opacity: 1 }, animations: { opacity: withTiming(0, FADE) } };
    return {
      initialValues: { opacity: 1, transform: [{ scale: 1 }, { rotate: "0deg" }] },
      animations: {
        opacity: withSpring(0, SETTLE),
        transform: [{ scale: withSpring(1.12, SETTLE) }, { rotate: withSpring("-4deg", SETTLE) }],
      },
    };
  };
}

/** Simple fade, for small labels that swap places. */
export function fadeIn(): EntryExitAnimationFunction {
  return () => {
    "worklet";
    return { initialValues: { opacity: 0 }, animations: { opacity: withTiming(1, FADE) } };
  };
}

export function fadeOut(): EntryExitAnimationFunction {
  return () => {
    "worklet";
    return { initialValues: { opacity: 1 }, animations: { opacity: withTiming(0, FADE) } };
  };
}
