"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { DenunciasChart } from "./denuncias-chart"
import { HeatmapChart } from "./heatmap-chart"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type DashboardStats = {
  totalDenuncias: number
  taxaResposta: number
  tempoMedioResposta: string
  denunciasPendentes: number
  comparativoTotal: string
  comparativoTaxa: string
  comparativoTempo: string
  comparativoPendentes: string
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        // Buscar total de denúncias
        const { data: denuncias, error: denunciasError } = await supabase
          .from('denuncias')
          .select('id, estado, criada_em')
          .order('criada_em', { ascending: false })

        if (denunciasError) throw denunciasError
        
        // Buscar respostas para calcular tempo médio
        const { data: respostas, error: respostasError } = await supabase
          .from('respostas')
          .select('id, denuncia_id, respondida_em')
          .order('respondida_em', { ascending: false })

        if (respostasError) throw respostasError

        // Calcular estatísticas
        const totalDenuncias = denuncias?.length || 0
        
        // Denúncias com resposta
        const denunciasRespondidas = denuncias?.filter(d => d.estado === 'respondida')?.length || 0
        const taxaResposta = totalDenuncias > 0 ? Math.round((denunciasRespondidas / totalDenuncias) * 100) : 0
        
        // Denúncias pendentes
        const denunciasPendentes = denuncias?.filter(d => d.estado === 'pendente')?.length || 0
        
        // Tempo médio de resposta (em horas)
        let tempoMedioHoras = 0
        let tempoMedioMinutos = 0
        
        if (respostas && respostas.length > 0 && denuncias && denuncias.length > 0) {
          // Mapear respostas por denúncia
          const respostasPorDenuncia = new Map()
          respostas.forEach(resposta => {
            respostasPorDenuncia.set(resposta.denuncia_id, resposta.respondida_em)
          })
          
          // Calcular tempo de resposta para cada denúncia respondida
          let tempoTotalMs = 0
          let denunciasComResposta = 0
          
          denuncias.forEach(denuncia => {
            const dataResposta = respostasPorDenuncia.get(denuncia.id)
            if (dataResposta) {
              const criadaEm = new Date(denuncia.criada_em).getTime()
              const respondidaEm = new Date(dataResposta).getTime()
              const diferencaMs = respondidaEm - criadaEm
              
              if (diferencaMs > 0) {
                tempoTotalMs += diferencaMs
                denunciasComResposta++
              }
            }
          })
          
          if (denunciasComResposta > 0) {
            const tempoMedioMs = tempoTotalMs / denunciasComResposta
            tempoMedioHoras = Math.floor(tempoMedioMs / (1000 * 60 * 60))
            tempoMedioMinutos = Math.floor((tempoMedioMs % (1000 * 60 * 60)) / (1000 * 60))
          }
        }
        
        // Comparativos (simulados por enquanto, mas poderiam ser calculados com dados históricos)
        const comparativoTotal = "+5.2%"
        const comparativoTaxa = "+2.1%"
        const comparativoTempo = "-12.5%"
        const comparativoPendentes = denunciasPendentes > 0 ? `-${Math.min(3, denunciasPendentes)}` : "0"
        
        setStats({
          totalDenuncias,
          taxaResposta,
          tempoMedioResposta: `${tempoMedioHoras}h:${tempoMedioMinutos}m`,
          denunciasPendentes,
          comparativoTotal,
          comparativoTaxa,
          comparativoTempo,
          comparativoPendentes
        })
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Denúncias</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDenuncias || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.comparativoTotal || "0%"} em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.taxaResposta || 0}%</div>
            <p className="text-xs text-muted-foreground">{stats?.comparativoTaxa || "0%"} em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tempoMedioResposta || "0h:0m"}</div>
            <p className="text-xs text-muted-foreground">{stats?.comparativoTempo || "0%"} em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denúncias Pendentes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.denunciasPendentes || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.comparativoPendentes || "0"} em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Denúncias por Mês</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DenunciasChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Horários de Envio</CardTitle>
            <CardDescription>Distribuição de denúncias por hora do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
