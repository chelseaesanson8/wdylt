import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, Spectral } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
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
    icon: [{ url: "/brand/wdylt-2-signature-icon-dark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/wdylt-2-signature-icon-dark-1024.png" }],
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
    <html lang="en" className={`${bodoni.variable} ${spectral.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
