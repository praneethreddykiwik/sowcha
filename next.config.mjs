/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A lockfile exists further up the filesystem; pin tracing to this project.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // Cloudinary is the only image host. Swap the hostname if you use a custom CNAME.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
