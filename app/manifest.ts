import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Fellowship',
    short_name: 'Fellowship',
    description: 'A private space for writing and reading.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#0F172A',
    orientation: 'portrait',
    icons: [
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  }
}
