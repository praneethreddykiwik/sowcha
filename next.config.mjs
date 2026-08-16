import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// `import.meta.dirname` needs Node >= 20.11; this form works on every Node that
// can run Next 15, so the build behaves the same locally and on Vercel.
const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A lockfile exists further up the filesystem; pin tracing to this project.
  outputFileTracingRoot: projectRoot,
  images: {
    // Cloudinary is the only image host. Swap the hostname if you use a custom CNAME.
    remotePatterns: [
      // Supabase Storage — everything uploaded through the admin page.
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
