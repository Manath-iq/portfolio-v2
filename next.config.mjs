// На GitHub Pages сайт открывается по подпути /portfolio-v2/, на боевом
// домене — из корня. Один и тот же билд обслуживает оба случая: префикс
// задаётся переменной, дальше его разбирает src/lib/asset.ts.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // без него внутренние страницы на шаред-хостинге отдадут 404
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
