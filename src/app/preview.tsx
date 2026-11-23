/**
 * Theme preview: every Vermilion Block piece on one screen, so you can see
 * them on a real phone in Expo Go. Use the Paper / Ink buttons at the top
 * to flip between light and dark without changing your phone's setting.
 *
 * This screen is just for us while building. It can go before launch.
 */
import { Link } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Button,
  Perforation,
  RedBarHeader,
  Seal,
  SquaredPaper,
  stamped,
  StampCard,
  Streak,
  Text,
  type Day,
} from "@/components/vermilion";
import { palettes, type as typeScale, useTheme, type ColorName, type ThemeMode, type TypeVariant } from "@/theme";

// November 2026, stamped every day up to today (the 23rd) except the 9th.
const NOVEMBER_STAMPED = Array.from({ length: 22 }, (_, i) => i + 1).filter((d) => d !== 9);

// A streak with two missed days in it, to show how a missed day looks.
const DAYS_WITH_GAPS: Day[] = [...stamped(9), "missed", ...stamped(14), "missed", ...stamped(6)];

export default function Preview() {
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>
      <RedBarHeader count="47" title="books high" note="one per page" sideLabel="In a row" seal />

      <View className="gap-10 px-6 pt-8">
        <Section title="Paper or ink">
          <View className="flex-row gap-2">
            {(["system", "paper", "ink"] as ThemeMode[]).map((m) => (
              <ModeChip key={m} label={m === "system" ? "Follow phone" : m} active={mode === m} onPress={() => setMode(m)} />
            ))}
          </View>
        </Section>

        <Section title="Type">
          {(Object.keys(typeScale) as TypeVariant[]).map((v) => (
            <View key={v} className="gap-1">
              <Text variant="label" tone="muted">
                {v}
              </Text>
              <Text variant={v} numberOfLines={1}>
                {v === "count" ? "47" : v === "number" ? "Page 47" : sampleFor(v)}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Colours">
          <View className="flex-row flex-wrap gap-3">
            {(Object.keys(palettes.paper) as ColorName[]).map((name) => (
              <View key={name} className="w-[30%] gap-1">
                <View className="h-12 border border-rule" style={{ backgroundColor: colors[name] }} />
                <Text variant="small" numberOfLines={1}>
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Seal">
          <View className="flex-row items-center gap-5">
            <Seal size={72} seed={4} />
            <Seal size={72} seed={11} shape="circle" />
            <Seal size={44} seed={21} rotate={0} wear={0.1} />
            <View className="bg-block p-3">
              <Seal size={64} seed={3} color={colors.onBlock} />
            </View>
          </View>
        </Section>

        <Section title="Squared paper">
          <Text variant="label" tone="muted">
            Yesterday · 22 Nov
          </Text>
          <SquaredPaper text="Planted garlic. It needs a cold winter to split into cloves." />
          <Text variant="small" tone="muted">
            Empty, ready to write on:
          </Text>
          <SquaredPaper rows={2} />
        </Section>

        <Section title="Buttons">
          <Button label="Open today's page" />
          <Button label="Stamp the day" variant="red" />
          <Button label="Add a note" variant="outline" />
        </Section>

        <Section title="Perforation">
          <Text>Bread rises faster in a warm oven with only the light on.</Text>
          <Perforation />
          <Text>A capo moves every chord up without new fingerings.</Text>
        </Section>

        <Section title="Book stack: the streak">
          <Text variant="small" tone="muted">
            Every page you stamp adds a book. Today&apos;s is on top, in red.
          </Text>
          <Streak days={stamped(47)} todayNote="sourdough" milestones />
        </Section>

        <Section title="Missed days (not decided yet)">
          <Text variant="small" tone="muted">
            Placeholder: a blank, dashed book where the missed day was.
          </Text>
          <Streak days={DAYS_WITH_GAPS} todayNote="sourdough" />
          <Text variant="small" tone="muted">
            The mockup&apos;s idea: a missed day starts a new stack.
          </Text>
          <Streak days={DAYS_WITH_GAPS} todayNote="sourdough" missedDay="new-stack" />
        </Section>

        <Section title="Stamp card: the month">
          <View className="flex-row justify-between">
            <Text variant="label">November</Text>
            <Text variant="small" tone="muted">
              {NOVEMBER_STAMPED.length} pages so far
            </Text>
          </View>
          <StampCard year={2026} month={11} stamped={NOVEMBER_STAMPED} today={23} />
          <Text variant="small" tone="muted">
            Before the first stamp (today is dashed):
          </Text>
          <StampCard year={2026} month={11} stamped={[]} today={23} />
        </Section>

        <Link href="/" asChild>
          <Button label="Back" variant="outline" mark={false} />
        </Link>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <View className="h-3 w-3 bg-verm" />
        <Text variant="heading">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ModeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={active ? "border-2 border-ink px-3 py-2" : "border border-rule px-3 py-2"}
    >
      <Text variant="label" tone={active ? "ink" : "muted"}>
        {label}
      </Text>
    </Pressable>
  );
}

function sampleFor(variant: TypeVariant) {
  switch (variant) {
    case "display":
      return "Welcome back.";
    case "title":
      return "What did you learn today?";
    case "heading":
      return "books high";
    case "label":
      return "Yesterday · 22 Nov";
    case "button":
      return "Stamp the day";
    case "small":
      return "one thing, a sentence or two";
    default:
      return "Planted garlic. It needs a cold winter.";
  }
}
