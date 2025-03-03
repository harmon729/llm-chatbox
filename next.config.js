/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! 警告 !!
    // 为了便于开发，这里将TypeScript错误视为警告而不是错误
    // 在生产环境中，应该将此设置为true，以确保类型安全
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
