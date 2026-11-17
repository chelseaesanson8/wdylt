import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
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
      { url: "/favicon.svg", type: "image/svg+xml" },
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
  themeColor: "#14151A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
