import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', 'firebase-admin', 'google-auth-library'],
};

export default nextConfig;
