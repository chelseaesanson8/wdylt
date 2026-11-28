/**
 * Haptics, kept for the moments that matter.
 *
 * The Apple guide's rule: feedback has to be caused by something you can see,
 * land on the same frame as it, and be rare enough to mean something. So the
 * app taps your hand for only two things:
 *
 *   haptics.stamp()      a day's page is stamped (an entry is posted)
 *   haptics.milestone()  the streak reaches a round number (every 10th book)
 *
 * Plain buttons, scrolling and switches don't buzz. Call these at the same
 * moment the screen changes, not after an animation finishes.
 */
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const available = Platform.OS === "ios" || Platform.OS === "android";

export const haptics = {
  stamp() {
    if (available) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  milestone() {
    if (available) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },
};
