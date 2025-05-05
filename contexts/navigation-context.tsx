"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

type NavigationContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
  navigateTo: (path: string, section: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>("overview")

  // Mapear caminhos para seções
  const pathToSection: Record<string, string> = {
    "/admin/dashboard": "overview",
    "/admin/denuncias": "denuncias",
    "/admin/usuarios": "usuarios",
    "/admin/empresas": "empresas",
    "/admin/responsaveis": "responsaveis",
    "/admin/configuracoes": "configuracoes"
  }

  // Atualizar a seção ativa quando o caminho mudar
  useEffect(() => {
    if (pathname && pathToSection[pathname]) {
      setActiveSection(pathToSection[pathname])
    }
  }, [pathname])

  // Função para navegar e atualizar a seção ativa
  const navigateTo = (path: string, section: string) => {
    setActiveSection(section)
    router.push(path)
  }

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation deve ser usado dentro de um NavigationProvider")
  }
  return context
}
