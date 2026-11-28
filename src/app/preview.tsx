/**
 * Theme preview: every Vermilion Block piece on one screen, so you can see
 * them on a real phone in Expo Go. Use the Paper / Ink buttons at the top
 * to flip between light and dark without changing your phone's setting.
 *
 * Try "Stamp the day" near the top: today's book drops onto the pile, the
 * seal presses onto today's square and your phone gives one tap. "Undo"
 * takes it back the same way. Turn on Reduce Motion or Increase Contrast in
 * the phone's Accessibility settings to see the gentler versions.
 *
 * This screen is just for us while building. It can go before launch.
 */
import { Link } from "expo-router";
import { useState, type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Button,
  Perforation,
  Press,
  RedBarHeader,
  Seal,
  SquaredPaper,
  stamped,
  StampCard,
  Streak,
  Text,
  type Day,
} from "@/components/vermilion";
import { palettes, space, type as typeScale, useTheme, type ColorName, type ThemeMode, type TypeVariant } from "@/theme";
import { haptics } from "@/theme/haptics";

// November 2026, stamped every day up to today (the 23rd) except the 9th.
const NOVEMBER_STAMPED = Array.from({ length: 22 }, (_, i) => i + 1).filter((d) => d !== 9);

// Two weeks with two missed days, like the ghost book mockup (misses on Fri 14 and Wed 19).
const TWO_WEEKS: Day[] = [...stamped(4), "missed", ...stamped(4), "missed", ...stamped(4)];

// The same two weeks up to yesterday, for the "Stamp the day" demo. Today is the 14th day.
const UP_TO_YESTERDAY = TWO_WEEKS.slice(0, -1);

export default function Preview() {
  const { colors, mode, setMode, a11y } = useTheme();
  const insets = useSafeAreaInsets();
  const [stampedToday, setStampedToday] = useState(false);

  const demoDays: Day[] = stampedToday ? [...UP_TO_YESTERDAY, "stamped"] : UP_TO_YESTERDAY;
  const toggleToday = () => {
    const next = !stampedToday;
    setStampedToday(next);
    // The tap lands on the same frame the book starts to drop. Undo is silent.
    if (!next) return;
    if ((demoDays.length + 1) % 10 === 0) haptics.milestone();
    else haptics.stamp();
  };

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>
      <RedBarHeader count="47" title="books high" note="one per page" sideLabel="In a row" seal />

      <View className="gap-s5 px-s3 pt-s4">
        <Section title="Try it: stamp the day">
          <Text variant="small" tone="muted">
            Press the button. Today&apos;s book drops onto the pile, the seal presses onto today&apos;s square, and your phone taps once.
            Undo lifts both back off.
          </Text>
          <Streak days={demoDays} current={stampedToday} todayNote="sourdough" bookHeight={[20, 26]} holds={TWO_WEEKS.length} />
          <StampCard year={2026} month={11} stamped={stampedToday ? [...NOVEMBER_STAMPED, 23] : NOVEMBER_STAMPED} today={23} />
          <Button
            label={stampedToday ? "Undo today's stamp" : "Stamp the day"}
            variant={stampedToday ? "outline" : "red"}
            onPress={toggleToday}
          />
        </Section>

        <Section title="Your phone's settings">
          <Text variant="small" tone="muted">
            The theme follows these from Settings, Accessibility.
          </Text>
          <Setting label="Reduce Motion" on={a11y.reduceMotion} note="things fade instead of moving" />
          <Setting label="Increase Contrast" on={a11y.increaseContrast} note="greys and hairlines turn full ink" />
          <Setting label="Reduce Transparency" on={a11y.reduceTransparency} note="nothing is see-through yet" />
        </Section>

        <Section title="Paper or ink">
          <View className="flex-row gap-s1">
            {(["system", "paper", "ink"] as ThemeMode[]).map((m) => (
              <ModeChip key={m} label={m === "system" ? "Follow phone" : m} active={mode === m} onPress={() => setMode(m)} />
            ))}
          </View>
        </Section>

        <Section title="Type">
          {(Object.keys(typeScale) as TypeVariant[]).map((v) => (
            <View key={v} className="gap-hair">
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
          <View className="flex-row flex-wrap gap-s2">
            {(Object.keys(palettes.paper) as ColorName[]).map((name) => (
              <View key={name} className="w-[29%] gap-hair">
                <View className="h-12 border border-rule" style={{ backgroundColor: colors[name] }} />
                <Text variant="small" numberOfLines={1}>
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Seal">
          <View className="flex-row items-center gap-s3">
            <Seal size={72} seed={4} />
            <Seal size={72} seed={11} shape="circle" />
            <Seal size={44} seed={21} rotate={0} wear={0.1} />
            <View className="bg-block p-s2">
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

        <Section title="Missed days: the ghost book">
          <Text variant="small" tone="muted">
            A missed day leaves a blank book, and the stack keeps growing.
          </Text>
          <Streak days={TWO_WEEKS} todayNote="sourdough" bookHeight={[20, 26]} />
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
    <View className="gap-s2">
      <View className="flex-row items-center gap-s2">
        <View className="h-3 w-3 bg-verm" />
        <Text variant="heading">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ModeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Press
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: space.s2,
        borderWidth: active ? 2 : 1,
        borderColor: active ? colors.ink : colors.rule,
      }}
    >
      <Text variant="label" tone={active ? "ink" : "muted"}>
        {label}
      </Text>
    </Press>
  );
}

function Setting({ label, on, note }: { label: string; on: boolean; note: string }) {
  return (
    <View className="flex-row items-baseline justify-between gap-s2">
      <View className="shrink">
        <Text>{label}</Text>
        <Text variant="small" tone="muted">
          {note}
        </Text>
      </View>
      <Text variant="label" tone={on ? "vermText" : "muted"}>
        {on ? "On" : "Off"}
      </Text>
    </View>
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
