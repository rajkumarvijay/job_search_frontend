import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JobQuest India — Every Great Career Starts with a Search',
  description:
    'Search jobs across LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter and Google Jobs. Save jobs, track your history, explore salary bands and skill roadmaps.',
  keywords: ['job search India', 'naukri', 'linkedin jobs', 'indeed India', 'software jobs Bangalore'],
  openGraph: {
    title: 'JobQuest India',
    description: 'Every Great Career Starts with a Search',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        {/* ClerkProvider must be inside <body>, never wrapping <html> */}
        <ClerkProvider>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
