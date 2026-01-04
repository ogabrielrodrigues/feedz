import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import type { PropsWithChildren } from "react"
import { Toaster } from "@/components/ui/sonner"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Minerva - Feedz",
  description: "Minerva - Feedz",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} h-svh w-svw flex flex-col overflow-x-hidden font-sans antialiased bg-background`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  )
}
