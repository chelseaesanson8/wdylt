import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

// Headings: Newsreader, a text serif with optical sizes, so it stays elegant
// large and clear small. Reading text: Inter, built for screens. The logo
// is Newsreader italic too, outlined inside its SVG.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Write down one thing you learned each day. We'll match you with people learning the same things.";

export const metadata: Metadata = {
  title: "What Did You Learn Today",
  description,
  openGraph: {
    title: "What did you learn today?",
    description,
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      // Ink icon on dark systems, paper icon on light ones.
      { url: "/favicon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-paper.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  twitter: {
    card: "summary",
    title: "What did you learn today?",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EA" },
    { media: "(prefers-color-scheme: dark)", color: "#14151A" },
  ],
  colorScheme: "dark light",
};

// Runs before the first paint: applies a light or dark choice the visitor
// made earlier with the toggle. With no stored choice the CSS follows the
// system setting, so nothing flashes either way.
const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script may set data-theme before React hydrates.
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
