"use client"

import { useState } from "react"
import { AdminLayout } from "../components/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "../dashboard/dashboard-overview"
import { DenunciasList } from "../dashboard/denuncias-list"
import { EmpresasList } from "../dashboard/empresas-list"
import { UsuariosList } from "../dashboard/usuarios-list"
import { ResponsaveisList } from "../dashboard/responsaveis-list"

export default function ResponsaveisPage() {
  const [activeTab, setActiveTab] = useState("responsaveis")

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Responsáveis</h2>
        </div>
        <Tabs defaultValue="responsaveis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
