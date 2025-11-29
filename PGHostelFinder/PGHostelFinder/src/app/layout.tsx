import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PG & Hostel Finder - Find Student Accommodation in India',
  description: 'Find PGs and hostels near colleges across Delhi, Mumbai, Bangalore, Pune, and Hyderabad. Compare rent, filter by gender, food options, and more.',
  keywords: 'PG, hostel, student accommodation, paying guest, Delhi, Mumbai, Bangalore, Pune, Hyderabad',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  )
}
