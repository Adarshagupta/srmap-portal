/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['student.srmap.edu.in'],
  },
  // Removed rewrites - API URL is now handled via environment variables in src/lib/api.ts
};

export default nextConfig;
