import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Lato } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'Ratego – Skill-Based Training & Learning',
  description:
    'Ratego offers practical, skill-focused training courses with live lessons, hands-on projects, and expert instruction. Master in-demand competencies at your own pace.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lato.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Footer />
        </ThemeProvider>

        {/* Zoho SalesIQ Chat Widget */}
        <Script id="zoho-siq-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
        </Script>
        <Script
          id="zoho-siq-widget"
          src="https://salesiq.zohopublic.com/widget?wc=siq87cd60ebb7c6a6b874552fdc2baa12c7a46e7a162b36cc0933ca13341c685f77"
          defer
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
