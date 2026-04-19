import type { Metadata, Viewport } from 'next'
import { Lora, Merriweather, Inter, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import './globals.css'

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Fellowship',
  description: 'A private space for writing and reading.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fellowship',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`${lora.variable} ${merriweather.variable} ${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-bg-base text-text-primary">
        {children}
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
