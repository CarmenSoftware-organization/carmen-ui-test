import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Carmen UI Test',
  description: 'Testing environment for Carmen UI components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
