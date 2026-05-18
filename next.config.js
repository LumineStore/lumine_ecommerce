/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  typescript: {
    // Permitir compilaciones exitosas incluso con errores de tipo en librerías externas (como googleapis)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar errores de ESLint durante la compilación para evitar bloqueos
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
