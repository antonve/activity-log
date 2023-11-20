import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Activity Log',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-gray-200 py-6 px-4 bg-slate-100">
          <h1 className="font-bold text-lg">Activity</h1>
        </header>
        {children}
      </body>
    </html>
  )
}
