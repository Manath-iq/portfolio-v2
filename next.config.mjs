/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // без него внутренние страницы на шаред-хостинге отдадут 404
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
