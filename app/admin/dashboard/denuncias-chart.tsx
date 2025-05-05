"use client"
import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

type MonthData = {
  name: string
  total: number
}

export function DenunciasChart() {
  const [data, setData] = useState<MonthData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDenunciasPorMes() {
      setIsLoading(true)
      try {
        // Buscar todas as denúncias
        const { data: denuncias, error } = await supabase
          .from('denuncias')
          .select('id, criada_em')
          .order('criada_em', { ascending: true })

        if (error) throw error

        // Inicializar array com todos os meses do ano
        const meses = [
          { name: "Jan", total: 0 },
          { name: "Fev", total: 0 },
          { name: "Mar", total: 0 },
          { name: "Abr", total: 0 },
          { name: "Mai", total: 0 },
          { name: "Jun", total: 0 },
          { name: "Jul", total: 0 },
          { name: "Ago", total: 0 },
          { name: "Set", total: 0 },
          { name: "Out", total: 0 },
          { name: "Nov", total: 0 },
          { name: "Dez", total: 0 }
        ]

        // Contar denúncias por mês
        if (denuncias && denuncias.length > 0) {
          denuncias.forEach(denuncia => {
            const data = new Date(denuncia.criada_em)
            const mes = data.getMonth() // 0-11
            meses[mes].total += 1
          })
        }

        setData(meses)
      } catch (error) {
        console.error('Erro ao buscar denúncias por mês:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDenunciasPorMes()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#105CC6"
          strokeWidth={2}
          activeDot={{ r: 6, fill: "#105CC6", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
