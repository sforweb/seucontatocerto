"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { MessageSquare, Clock, CalendarDays, Building, AlertCircle, Info, CheckCircle } from "lucide-react"

interface ProtocoloResultProps {
  result: {
    protocolo: string
    empresa: string
    dataRegistro: string
    status: "pendente" | "em_analise" | "respondido"
    resposta: string
    dataResposta: string
  }
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function ProtocoloResult({ result }: ProtocoloResultProps) {
  const statusMap = {
    pendente: {
      label: "Pendente",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      icon: AlertCircle,
      message: "Sua denúncia foi registrada e está aguardando análise inicial.",
    },
    em_analise: {
      label: "Em Análise",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      icon: Info,
      message: "Sua denúncia está sendo analisada pela empresa. Aguarde o retorno.",
    },
    respondido: {
      label: "Respondido",
      color: "bg-green-50 text-green-800 border-green-200",
      icon: CheckCircle,
      message: "Sua denúncia foi respondida pela empresa.",
    },
  }

  const status = statusMap[result.status]
  const StatusIcon = status.icon

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Card className="shadow-elevated border border-slate-100 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 px-8 py-6 border-b border-slate-100 bg-primary/5">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Resultado da Consulta</div>
            <CardTitle className="text-2xl">Protocolo {result.protocolo}</CardTitle>
          </div>
          <Badge variant="outline" className={`px-3 py-1.5 ${status.color} text-sm font-medium h-auto`}>
            <StatusIcon className="mr-1.5 h-4 w-4" />
            {status.label}
          </Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                  <p className="text-lg font-medium mt-1">{result.empresa}</p>
                </div>
              </div>

              <div className="flex">
                <CalendarDays className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
                  <p className="text-lg mt-1">{result.dataRegistro}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-md p-4 border ${status.color}`}>
              <div className="flex items-start">
                <StatusIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Status: {status.label}</p>
                  <p className="mt-1 text-sm">{status.message}</p>
                </div>
              </div>
            </div>

            {result.status === "respondido" && (
              <>
                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                    <h3 className="text-lg font-medium">Resposta da Empresa</h3>
                  </div>

                  <div className="rounded-lg bg-light/60 p-6 border border-slate-100 text-foreground">
                    <p className="whitespace-pre-line">{result.resposta}</p>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Respondido em: {result.dataResposta}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
