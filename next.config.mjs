/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export → `out/` folder, served by Firebase Hosting
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
}

export default nextConfig
