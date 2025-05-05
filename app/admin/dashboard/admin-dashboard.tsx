"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "../components/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "./dashboard-overview"
import { DenunciasList } from "./denuncias-list"
import { EmpresasList } from "./empresas-list"
import { UsuariosList } from "./usuarios-list"
import { ResponsaveisList } from "./responsaveis-list"
import { useNavigation } from "@/contexts/navigation-context"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const { activeSection, setActiveSection } = useNavigation()
  const router = useRouter()

  const handleTabChange = (value: string) => {
    setActiveSection(value)
    
    // Navegar para a página correspondente
    const tabToPath: Record<string, string> = {
      "overview": "/admin/dashboard",
      "denuncias": "/admin/denuncias",
      "usuarios": "/admin/usuarios",
      "empresas": "/admin/empresas",
      "responsaveis": "/admin/responsaveis"
    }
    
    if (tabToPath[value]) {
      router.push(tabToPath[value])
    }
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs value={activeSection} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="denuncias" className="space-y-4">
            <DenunciasList />
          </TabsContent>
          <TabsContent value="usuarios" className="space-y-4">
            <UsuariosList />
          </TabsContent>
          <TabsContent value="empresas" className="space-y-4">
            <EmpresasList />
          </TabsContent>
          <TabsContent value="responsaveis" className="space-y-4">
            <ResponsaveisList />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
