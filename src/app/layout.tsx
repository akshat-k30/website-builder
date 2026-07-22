import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import SessionProvider from "@/components/SessionProvider"
import Navbar from "@/components/Navbar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Profilio - AI-Powered Personal Websites",
  description:
    "Paste your LinkedIn URL, generate a professional website with AI, and publish in minutes.",
  icons: {
    icon: [{ url: "/profilio-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/profilio-favicon.svg",
    apple: "/profilio-icon-indigo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
