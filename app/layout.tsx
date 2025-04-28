import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Reservas de Parrilla",
  description: "Reserva la parrilla para tu próximo evento",
  icons: {
    icon: [
      { url: "/flame.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/flame.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col items-center">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
