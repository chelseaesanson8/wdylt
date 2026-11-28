# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## The look: Vermilion Block

Cream paper, black blocks, a vermilion bar, squared paper and the "w." seal. Paper (light) and Ink (dark) follow the phone's setting.

- **Change a colour, font, text size, spacing step or spring:** `src/theme/tokens.js`. Everything else reads from there, including NativeWind classes like `bg-paper`, `text-ink`, `font-gothic-bold`, `text-title` and `gap-s2`.
- **Pieces to build screens with:** `src/components/vermilion` (`Text`, `Button`, `Press`, `RedBarHeader`, `Seal`, `Wordmark`, `SquaredPaper`, `Streak`/`BookStack`, `StampCard`, `Perforation`).
- **See them all:** run the app and tap **See the theme**, or open the `/preview` screen.
- **Fonts:** Zen Kaku Gothic New and Dela Gothic One (Latin only), in `assets/fonts`, under the SIL Open Font License.

### How it should feel

The app follows the same Apple design guide as the landing page (version 2), so the two match:

- **Touch:** anything tappable is a `Press` (or a `Button`, which is built on it). It sinks to 97% the instant a finger lands and springs back on release.
- **Motion:** springs that settle without bouncing (`spring("settle")` in `src/theme/motion.ts`). Things leave the way they came, like today's book dropping onto the streak and lifting back off on undo. Bounce (`spring("flick")`) is only for something the person threw.
- **Haptics:** only two, from `src/theme/haptics.ts`: `haptics.stamp()` when a day is stamped and `haptics.milestone()` every 10th book. Nothing else buzzes.
- **Type:** letter spacing changes with size (tight headlines, slightly open small capitals, body at 0) and line height falls as size grows. Text grows with the phone's text-size setting; the biggest steps are capped so they can't break a screen.
- **Spacing:** one scale, `hair` (4) then `s1` to `s7` (8, 16, 24, 32, 48, 64, 96), the same steps as the landing page.
- **Accessibility:** `useTheme().a11y` reads Reduce Motion (movement becomes a fade), Increase Contrast (greys and hairlines go full ink) and Reduce Transparency (for anything see-through we add later).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
