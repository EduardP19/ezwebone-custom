import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseRemotePattern = supabaseUrl
  ? new URL("/storage/v1/object/public/**", supabaseUrl)
  : null;
const wixStaticRemotePattern = new URL("https://static.wixstatic.com/media/**");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      ...(supabaseRemotePattern ? [supabaseRemotePattern] : []),
      wixStaticRemotePattern,
    ],
  },
};

export default nextConfig;
