import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "./components/RouteTransition";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { SiteWeb } from "./components/SiteWeb";
import { THEME_INIT_SCRIPT } from "./components/ThemeToggle";
import { buildSearchIndex } from "@/lib/search";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodGenome AI — nutrition intelligence for any dish",
  description:
    "Photograph a dish and get a calibrated prediction, a conformal candidate set, and USDA-grounded nutrition across 101 food categories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* suppressHydrationWarning is load-bearing on both elements. The theme
       script below stamps data-theme on <html> before React hydrates — that is
       the whole point of running it pre-paint — so the server markup cannot
       match by construction. On <body> it absorbs attributes injected by
       browser extensions, which are outside our control and would otherwise
       fill a console with a warning about markup we did not write. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      {/* Applied before first paint. Running this in an effect instead would
          show a dark-mode reader a full white frame on every navigation. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SiteWeb />
        <RouteTransition />
        <SiteHeader searchIndex={buildSearchIndex()} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
