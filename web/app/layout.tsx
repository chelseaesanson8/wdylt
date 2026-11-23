import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

// Vermilion Block type: Zen Kaku Gothic New for text and headings (heavy
// weights for the big titles), Dela Gothic One for numbers. Latin only.
const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-num",
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
      // Black icon on dark systems, paper icon on light ones.
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
    // The masthead is a black block in both editions.
    { media: "(prefers-color-scheme: light)", color: "#1F1D1B" },
    { media: "(prefers-color-scheme: dark)", color: "#2A2724" },
  ],
  colorScheme: "light dark",
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
      className={`${zenKaku.variable} ${dela.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
