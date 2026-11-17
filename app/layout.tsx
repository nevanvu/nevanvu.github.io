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
// in its "queued" state without a flash. On the first visit of a browser
// session it also flags the intro sequence, unless the visitor prefers
// reduced motion; reloads and return trips skip it.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('nv-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro');sessionStorage.setItem('nv-intro','1');}}catch(e){}})();`;

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
