import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/uc/**', // Permite qualquer imagem vinda do caminho /uc/
      },
    ],
  },
};

export default nextConfig;
