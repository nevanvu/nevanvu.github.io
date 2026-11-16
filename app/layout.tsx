import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { profile } from "@/content";
import "./globals.css";

// Apple devices render in SF Pro via the system font; Inter, the closest
// free match, loads for everyone else.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.role}`,
  description: `${profile.headline} ${profile.intro}`,
};

export const viewport: Viewport = {
  themeColor: "#14161a",
  colorScheme: "dark",
  viewportFit: "cover",
};

// Runs before paint: flags that JS is available, so the pipeline can start
// in its "queued" state without a flash.
const bootScript = `document.documentElement.classList.add('js');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
