"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { MessageSquare, Clock, CalendarDays, Building, AlertCircle, Info, CheckCircle, User, FileText } from "lucide-react"

interface Resposta {
  id: string
  texto_resposta: string
  respondida_em: string
  admin_id: string
  admins: {
    id: string
    nome: string
  } | null
}

interface Denuncia {
  id: string
  protocolo: string
  empresa: string
  titulo: string
  descricao: string
  dataRegistro: string
  status: string
  respostas: Resposta[]
  anonima: boolean
  nome_denunciante?: string
}

interface DetalhesProtocoloProps {
  denuncia: Denuncia
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

export function DetalhesProtocolo({ denuncia }: DetalhesProtocoloProps) {
  // Mapeamento dos status conforme definidos no banco de dados
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
    }
  }

  // Processar as respostas para exibir corretamente
  const processarRespostas = () => {
    if (!denuncia.respostas || denuncia.respostas.length === 0) return [];
    
    const respostasProcessadas = [];
    
    for (const resposta of denuncia.respostas) {
      const textoResposta = resposta.texto_resposta;
      const partes = textoResposta.split(/---(.+?)---/).filter(Boolean);
      
      if (partes.length > 1) {
        // Se houver separadores, processar cada parte
        for (let i = 0; i < partes.length; i += 2) {
          const texto = partes[i].trim();
          const data = i + 1 < partes.length ? partes[i + 1].trim() : '';
          
          if (texto) {
            respostasProcessadas.push({
              id: `${resposta.id}-${i}`,
              texto: texto,
              data: data || new Date(resposta.respondida_em).toLocaleString('pt-BR'),
              original: false
            });
          }
        }
      } else {
        // Se não houver separadores, usar a resposta original
        respostasProcessadas.push({
          id: resposta.id,
          texto: textoResposta,
          data: new Date(resposta.respondida_em).toLocaleString('pt-BR'),
          original: true
        });
      }
    }
    
    return respostasProcessadas;
  };

  const respostasProcessadas = processarRespostas();

  // Garantir que o status seja um dos valores válidos
  const statusKey = denuncia.status as keyof typeof statusMap;
  const status = statusMap[statusKey] || statusMap.pendente;
  
  const StatusIcon = status.icon

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Card className="shadow-elevated border border-slate-100 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 px-8 py-6 border-b border-slate-100 bg-primary/5">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Resultado da Consulta</div>
            <CardTitle className="text-2xl">Protocolo {denuncia.protocolo}</CardTitle>
          </div>
          <Badge variant="outline" className={`px-3 py-1.5 ${status.color} text-sm font-medium h-auto`}>
            <StatusIcon className="mr-1.5 h-4 w-4" />
            {status.label}
          </Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Informações básicas em grid de 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg bg-light/60 p-4 border border-slate-100">
                <div className="flex">
                  <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                    <p className="text-lg font-medium mt-1">{denuncia.empresa}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-light/60 p-4 border border-slate-100">
                <div className="flex">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
                    <p className="text-lg mt-1">{denuncia.dataRegistro}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda linha de informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!denuncia.anonima && denuncia.nome_denunciante ? (
                <div className="rounded-lg bg-light/60 p-4 border border-slate-100">
                  <div className="flex">
                    <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Denunciante</p>
                      <p className="text-lg mt-1">{denuncia.nome_denunciante}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-light/60 p-4 border border-slate-100">
                  <div className="flex">
                    <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Denunciante</p>
                      <p className="text-lg mt-1">Anônimo</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-light/60 p-4 border border-slate-100">
                <div className="flex">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Título da Denúncia</p>
                    <p className="text-lg mt-1">{denuncia.titulo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição da denúncia */}
            <div className="rounded-lg bg-light/60 p-6 border border-slate-100">
              <h3 className="text-lg font-medium mb-3">Descrição</h3>
              <p className="whitespace-pre-line">{denuncia.descricao}</p>
            </div>

            {/* Status da denúncia */}
            <div className={`rounded-md p-4 border ${status.color}`}>
              <div className="flex items-start">
                <StatusIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Status: {status.label}</p>
                  <p className="mt-1 text-sm">{status.message}</p>
                </div>
              </div>
            </div>

            {/* Respostas */}
            {respostasProcessadas.length > 0 && (
              <>
                <Separator className="my-6" />

                <div className="space-y-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                    <h3 className="text-lg font-medium">Respostas da Empresa</h3>
                  </div>

                  <div className="space-y-4">
                    {respostasProcessadas.map((resposta, index) => (
                      <div key={resposta.id} className="rounded-lg bg-light/60 p-6 border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Resposta {index + 1}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{resposta.data}</span>
                          </div>
                        </div>
                        <p className="whitespace-pre-line">{resposta.texto}</p>
                      </div>
                    ))}
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
