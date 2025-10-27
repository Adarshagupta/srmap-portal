/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['student.srmap.edu.in'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
