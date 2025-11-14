import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables are automatically loaded by Next.js
  // No need to specify them in the config

  // Fix for external packages (updated configuration)
  serverExternalPackages: [],
};

export default nextConfig;
