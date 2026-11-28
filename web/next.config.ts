import path from "node:path";
import type { NextConfig } from "next";

// This app lives in web/ inside the Expo repo. Pin Next.js to this folder so
// it doesn't treat the repo root (with the Expo lockfile) as its workspace.
const root = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: { root },
  outputFileTracingRoot: root,
};

export default nextConfig;
