import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
        turbopackRustReactCompiler: true,
        turbopackCjsTreeShaking: true,
  },
  // Next.js auto-generated these; keep repo focused on the app itself
  agentRules: false,
};

export default nextConfig;
