/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Make sure config.watchOptions exists
    config.watchOptions = {
      ...config.watchOptions,
      poll: 300, // Assign poll value safely
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
