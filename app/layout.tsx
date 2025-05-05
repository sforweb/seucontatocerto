import type React from "react"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NavigationProvider } from "@/contexts/navigation-context"
import { Toaster } from "@/components/ui/toaster"

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Canal de Denúncias | Plataforma segura para colaboradores",
  description:
    "Canal seguro e independente para voz do colaborador. Registre suas insatisfações de forma anônima ou identificada.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/10 selection:text-primary",
          urbanist.variable,
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavigationProvider>
              {children}
              <Toaster />
            </NavigationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
