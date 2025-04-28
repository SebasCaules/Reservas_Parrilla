/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desactivar la compresión de imágenes para evitar problemas con las imágenes SVG
  images: {
    unoptimized: true,
  },
  // Configuración para desactivar caché agresiva
  experimental: {
    // Desactivar la caché de datos para asegurar datos frescos
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Configuración de encabezados para controlar la caché
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

export default nextConfig
