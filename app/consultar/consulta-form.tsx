"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, AlertCircle } from "lucide-react"
import { ProtocoloResult } from "./protocolo-result"

// Mock data for demonstration
const mockResults = {
  ABC123: {
    protocolo: "ABC123",
    empresa: "Empresa ABC Ltda",
    dataRegistro: "15/04/2023, 14:32:45",
    status: "respondido",
    resposta:
      "Agradecemos sua denúncia. Após investigação interna, identificamos o problema relatado e tomamos as seguintes medidas: 1) Conversa com o gestor mencionado; 2) Revisão das políticas de comunicação interna; 3) Treinamento adicional para lideranças. Pedimos desculpas pelo ocorrido e reforçamos nosso compromisso com um ambiente de trabalho respeitoso.",
    dataResposta: "22/04/2023, 10:15:22",
  },
  XYZ456: {
    protocolo: "XYZ456",
    empresa: "XYZ Serviços S.A.",
    dataRegistro: "20/04/2023, 09:18:33",
    status: "em_analise",
    resposta: "",
    dataResposta: "",
  },
  DEF789: {
    protocolo: "DEF789",
    empresa: "Indústrias 123 Ltda",
    dataRegistro: "18/04/2023, 16:45:12",
    status: "pendente",
    resposta: "",
    dataResposta: "",
  },
}

const formSchema = z.object({
  protocolo: z.string().min(5, {
    message: "O protocolo deve ter pelo menos 5 caracteres.",
  }),
})

export function ConsultaForm() {
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocolo: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true)
    setNotFound(false)
    setResult(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if protocol exists in mock data
      const protocolo = values.protocolo.toUpperCase()
      if (mockResults[protocolo as keyof typeof mockResults]) {
        setResult(mockResults[protocolo as keyof typeof mockResults])
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Erro ao buscar protocolo:", error)
      setNotFound(true)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-elevated border border-slate-100 overflow-hidden">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel className="text-lg">Número do Protocolo</FormLabel>
                <p className="text-muted-foreground text-sm">Digite o protocolo recebido após o registro da denúncia</p>
              </div>

              <FormField
                control={form.control}
                name="protocolo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Ex: ABC123" {...field} className="pl-10 h-12 flex-1" />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSearching}
                          variant="gradient"
                          size="lg"
                          className="h-12 min-w-[120px] md:min-w-[160px]"
                        >
                          {isSearching ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              <span>Buscando...</span>
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-5 w-5" />
                              <span>Consultar</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {notFound && (
        <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            Protocolo não encontrado. Verifique o número e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      {result && <ProtocoloResult result={result} />}
    </div>
  )
}
