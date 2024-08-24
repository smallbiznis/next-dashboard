/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;
