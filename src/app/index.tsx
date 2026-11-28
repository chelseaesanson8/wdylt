import { Link } from "expo-router";
import { View } from "react-native";

import { Button, Text, Wordmark } from "@/components/vermilion";

// A placeholder home screen until the real Today screen is built (WDY-21).
export default function Index() {
  return (
    <View className="flex-1 justify-center gap-s3 bg-paper px-s3">
      <Wordmark height={44} />
      <Text variant="title">What did you learn today?</Text>
      <Text tone="muted">The app isn&apos;t built yet, but its look is. Have a peek.</Text>
      <Link href="/preview" asChild>
        <Button label="See the theme" />
      </Link>
    </View>
  );
}
