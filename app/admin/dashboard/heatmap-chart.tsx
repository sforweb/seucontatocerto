"use client"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export function HeatmapChart() {
  const [data, setData] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchHorariosDenuncias() {
      setIsLoading(true)
      try {
        // Buscar todas as denúncias
        const { data: denuncias, error } = await supabase
          .from('denuncias')
          .select('id, criada_em')

        if (error) throw error

        // Inicializar matriz de dias e horas
        // 7 dias da semana (0 = domingo, 6 = sábado) x 24 horas
        const horarios: number[][] = Array(7).fill(0).map(() => Array(24).fill(0))

        // Contar denúncias por dia da semana e hora
        if (denuncias && denuncias.length > 0) {
          denuncias.forEach(denuncia => {
            const data = new Date(denuncia.criada_em)
            const diaSemana = data.getDay() // 0-6 (domingo-sábado)
            const hora = data.getHours() // 0-23
            
            horarios[diaSemana][hora] += 1
          })
        }

        // Normalizar os valores para a escala de cores (0-5)
        // Encontrar o valor máximo
        let maxValue = 0
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 24; j++) {
            maxValue = Math.max(maxValue, horarios[i][j])
          }
        }

        // Se houver dados, normalizar para a escala 0-5
        if (maxValue > 0) {
          for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
              // Normalizar para 0-5
              horarios[i][j] = Math.min(5, Math.floor((horarios[i][j] / maxValue) * 5))
            }
          }
        }

        setData(horarios)
      } catch (error) {
        console.error('Erro ao buscar horários de denúncias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHorariosDenuncias()
  }, [supabase])

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getColor = (value: number) => {
    const colors = ["bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"]
    return colors[value] || "bg-blue-50"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex">
          <div className="w-10"></div>
          {hours.map((hour) => (
            <div key={hour} className="w-8 text-center text-xs text-gray-500">
              {hour}
            </div>
          ))}
        </div>
        {data.map((row, dayIndex) => (
          <div key={dayIndex} className="flex items-center">
            <div className="w-10 text-xs font-medium text-gray-500">{days[dayIndex]}</div>
            {row.map((value, hourIndex) => (
              <div
                key={hourIndex}
                className={`m-0.5 h-6 w-6 rounded-sm ${getColor(value)}`}
                title={`${days[dayIndex]} ${hourIndex}h: ${value > 0 ? 'denúncias registradas' : 'nenhuma denúncia'}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
