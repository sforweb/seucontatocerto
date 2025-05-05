"use client"

import { useEffect } from "react"
import { AdminLayout } from "../components/admin-layout"
import { DenunciasList } from "../dashboard/denuncias-list"
import { useNavigation } from "@/contexts/navigation-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DenunciasPage() {
  const { activeSection, setActiveSection } = useNavigation()
  const router = useRouter()
  
  // Definir a seção ativa como "denuncias" ao montar o componente
  useEffect(() => {
    setActiveSection("denuncias")
  }, [setActiveSection])

  const handleTabChange = (value: string) => {
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
          <h2 className="text-3xl font-bold tracking-tight">Denúncias</h2>
        </div>
        <Tabs value={activeSection} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          </TabsList>
          <TabsContent value="denuncias" className="space-y-4">
            <DenunciasList />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
