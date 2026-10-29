import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: deploys to Vercel, Netlify, GitHub Pages or any static host.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
