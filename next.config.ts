import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  transpilePackages: ['@ducanh2912/next-pwa'],
};

export default nextConfig;
