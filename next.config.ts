import type { NextConfig } from "next";

// Set by the GitHub Pages workflow when the site is served from a sub-path.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export: deploys to Vercel, Netlify, GitHub Pages or any static host.
  output: "export",
  images: { unoptimized: true },
  basePath,
  // Plain <a href> links to files in public/ need the prefix added by hand.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
