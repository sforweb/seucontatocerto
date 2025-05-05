"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

interface ProtocoloStepProps {
  protocolo: string
  dataHora: string
}

export function ProtocoloStep({ protocolo, dataHora }: ProtocoloStepProps) {
  return (
    <div className="text-center">
      <div className="space-y-8">
        {/* Ícone de sucesso */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Título de sucesso */}
        <h2 className="text-2xl font-semibold">Denúncia registrada com sucesso!</h2>

        {/* Número de protocolo */}
        <div className="mx-auto max-w-md bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Seu número de protocolo</p>
          <p className="text-3xl font-bold text-primary">{protocolo}</p>
        </div>

        {/* Texto explicativo */}
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Guarde este número de protocolo para acompanhar o status da sua denúncia. Use-o na página de consulta para
          verificar atualizações e respostas.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link
            href="/"
            className="inline-flex h-12 px-8 items-center justify-center rounded-full border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/5 transition-colors"
          >
            Voltar para a página inicial
          </Link>
          <Link
            href="/consultar"
            className="inline-flex h-12 px-8 items-center justify-center rounded-full border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/5 transition-colors"
          >
            Consultar protocolo
          </Link>
        </div>
      </div>
    </div>
  )
}
