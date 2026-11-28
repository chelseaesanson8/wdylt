import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { fonts, ThemeProvider } from "@/theme";
import "../global.css";
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// Keep the splash screen up until the fonts have loaded, so text never
// flashes in the wrong font.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.gothic]: require("../../assets/fonts/ZenKakuGothicNew-Medium.ttf"),
    [fonts.gothicBold]: require("../../assets/fonts/ZenKakuGothicNew-Bold.ttf"),
    [fonts.gothicBlack]: require("../../assets/fonts/ZenKakuGothicNew-Black.ttf"),
    [fonts.number]: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </ConvexProvider>
  );
}
