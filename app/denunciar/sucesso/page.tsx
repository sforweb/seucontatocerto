"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, ArrowLeft, AlertCircle, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SucessoPage() {
  const searchParams = useSearchParams()
  const protocolo = searchParams.get("protocolo") || "PROTOCOLO"
  const dataHora = searchParams.get("dataHora") || new Date().toLocaleString("pt-BR")

  const copyToClipboard = () => {
    navigator.clipboard.writeText(protocolo)
    toast({
      title: "Protocolo copiado!",
      description: "O número do protocolo foi copiado para a área de transferência.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcff] page-fade-in">
      <Navbar />
      <main className="flex-1 bg-light/40 py-16">
        <div className="container max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para página inicial
          </Link>

          <Card className="shadow-elevated border border-slate-100 overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 px-8 py-10 border-b border-slate-100">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-100">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-semibold md:text-3xl">Denúncia Registrada com Sucesso!</CardTitle>
              <CardDescription className="text-base mt-2">
                Sua denúncia foi recebida e será analisada pela equipe responsável.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="rounded-lg bg-light/60 p-6 border border-slate-100">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Número do Protocolo:</p>
                  <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="font-mono text-lg font-semibold text-primary">{protocolo}</span>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      <span className="text-sm">Copiar</span>
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-light/60 p-6 border border-slate-100">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Data e Hora do Registro:</p>
                  <p className="text-lg text-foreground">{dataHora}</p>
                </div>

                <Alert variant="warning" className="bg-amber-50 border border-amber-200 text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-medium">
                    Importante: Guarde o número do protocolo para consultar o status da sua denúncia posteriormente.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                  <Button asChild variant="outline" className="h-12 w-full">
                    <Link href="/consultar">Consultar Status</Link>
                  </Button>
                  <Button asChild variant="gradient" className="h-12 w-full">
                    <Link href="/">
                      Voltar para a Página Inicial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
