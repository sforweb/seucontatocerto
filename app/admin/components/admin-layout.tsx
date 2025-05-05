"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/contexts/navigation-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShieldCheck, LayoutDashboard, Users, MessageSquare, Settings, LogOut, Menu, X, User, Building, UserCog } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const { activeSection, navigateTo } = useNavigation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
      active: activeSection === "overview",
    },
    {
      href: "/admin/denuncias",
      label: "Denúncias",
      icon: MessageSquare,
      section: "denuncias",
      active: activeSection === "denuncias",
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: Users,
      section: "usuarios",
      active: activeSection === "usuarios",
    },
    {
      href: "/admin/empresas",
      label: "Empresas",
      icon: Building,
      section: "empresas",
      active: activeSection === "empresas",
    },
    {
      href: "/admin/responsaveis",
      label: "Responsáveis",
      icon: UserCog,
      section: "responsaveis",
      active: activeSection === "responsaveis",
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: Settings,
      section: "configuracoes",
      active: activeSection === "configuracoes",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-lg text-primary">
            Canal de Denúncias
            <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Perfil</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut()
                  router.push("/admin/login")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white pt-16 transition-transform duration-300 md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => {
                  setIsSidebarOpen(false)
                  navigateTo(route.href, route.section)
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
