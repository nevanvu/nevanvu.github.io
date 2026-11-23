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
// reduced motion; reloads and return trips skip it. Unless the visit is a
// deep link (a #hash), that first visit opens on the welcome screen, with a
// greeting for the visitor's time of day; a failsafe lifts it if the app
// never starts, so the page can't get stuck behind it. The empty touchstart
// listener makes iOS Safari apply :active the moment a finger lands, so
// pressed states show on touch-down instead of not at all.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');document.addEventListener('touchstart',function(){},{passive:true});try{if(!sessionStorage.getItem('nv-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro');sessionStorage.setItem('nv-intro','1');if(!location.hash){var h=new Date().getHours();d.dataset.daypart=h>=5&&h<12?'morning':h>=12&&h<18?'afternoon':'evening';d.classList.add('welcome');setTimeout(function(){if(d.classList.contains('welcome')){d.classList.remove('welcome');dispatchEvent(new Event('nv:welcome-done'));}},9000);}}}catch(e){}})();`;

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
