import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist, Martian_Mono } from "next/font/google";
import { profile } from "@/content";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "variable",
  axes: ["opsz"],
});
const mono = Martian_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.role}`,
  description: `${profile.headline} ${profile.intro}`,
};

export const viewport: Viewport = {
  themeColor: "#0e0b09",
  colorScheme: "dark",
};

// Runs before paint: flags that JS is available, so the pipeline can start
// in its "queued" state without a flash.
const bootScript = `document.documentElement.classList.add('js');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
