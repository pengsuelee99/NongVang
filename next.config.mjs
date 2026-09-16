/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  transpilePackages: ['canvas-confetti', 'three', 'framer-motion', 'lucide-react'],
};

export default nextConfig;
