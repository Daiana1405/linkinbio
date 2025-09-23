// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptrqnfpxaxcnuswnecya.supabase.co",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },

  // ✅ works across versions/runtimes (incl. Netlify runtime)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // must be > your 5MB app limit
    },
  },
};

export default nextConfig;
