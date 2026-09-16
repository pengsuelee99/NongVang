/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/NongVang' : '',
  assetPrefix: isGitHubPages ? '/NongVang/' : '',
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
