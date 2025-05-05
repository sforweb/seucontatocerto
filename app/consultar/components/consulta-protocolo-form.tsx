"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DetalhesProtocolo } from "./detalhes-protocolo"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  protocolo: z.string().min(5, {
    message: "O protocolo deve ter pelo menos 5 caracteres.",
  }),
})

export function ConsultaProtocoloForm() {
  const [isSearching, setIsSearching] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocolo: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true)
    setNaoEncontrado(false)
    setResultado(null)
    setErro(null)

    try {
      // Buscar denúncia pelo protocolo
      const { data: denuncia, error: denunciaError } = await supabase
        .from('denuncias')
        .select(`
          id, 
          protocolo, 
          titulo, 
          descricao, 
          estado, 
          criada_em, 
          atualizada_em,
          anonima,
          nome_denunciante,
          empresa_id,
          empresas:empresas(id, razao_social)
        `)
        .eq('protocolo', values.protocolo.toUpperCase())
        .single()

      if (denunciaError) {
        if (denunciaError.code === 'PGRST116') {
          // Código para "não encontrado" no Supabase
          setNaoEncontrado(true)
        } else {
          console.error("Erro ao buscar denúncia:", denunciaError)
          setErro("Ocorreu um erro ao buscar o protocolo. Tente novamente mais tarde.")
        }
        return
      }

      if (!denuncia) {
        setNaoEncontrado(true)
        return
      }

      // Buscar respostas para a denúncia
      const { data: respostas, error: respostasError } = await supabase
        .from('respostas')
        .select(`
          id,
          texto_resposta,
          respondida_em,
          admin_id,
          admins:admins(id, nome)
        `)
        .eq('denuncia_id', denuncia.id)
        .order('respondida_em', { ascending: true })

      if (respostasError) {
        console.error("Erro ao buscar respostas:", respostasError)
      }

      // Mapear o estado para o formato esperado pelo componente DetalhesProtocolo
      let statusMapeado = denuncia.estado;
      if (denuncia.estado === 'respondida') {
        statusMapeado = 'respondido';
      } else if (denuncia.estado === 'pendente') {
        statusMapeado = 'pendente';
      } else if (denuncia.estado === 'arquivada') {
        statusMapeado = 'arquivada';
      }

      // Formatar os dados para exibição
      const denunciaFormatada = {
        id: denuncia.id,
        protocolo: denuncia.protocolo,
        empresa: denuncia.empresas?.razao_social || "Empresa não identificada",
        titulo: denuncia.titulo,
        descricao: denuncia.descricao,
        dataRegistro: new Date(denuncia.criada_em).toLocaleString('pt-BR'),
        status: statusMapeado,
        respostas: respostas || [],
        anonima: denuncia.anonima,
        nome_denunciante: denuncia.nome_denunciante
      }

      console.log("Status mapeado:", statusMapeado);
      console.log("Estado original:", denuncia.estado);

      setResultado(denunciaFormatada)
    } catch (error) {
      console.error("Erro ao buscar protocolo:", error)
      setErro("Ocorreu um erro ao buscar o protocolo. Tente novamente mais tarde.")
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
                          <Input placeholder="Ex: DEN123456" {...field} className="pl-10 h-12 rounded-md flex-1" />
                        </div>
                        <button
                          type="submit"
                          disabled={isSearching}
                          className="inline-flex h-12 px-8 items-center justify-center rounded-full border-2 border-primary/30 bg-primary text-white hover:bg-primary/90 transition-colors"
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
                        </button>
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

      {naoEncontrado && (
        <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            Protocolo não encontrado. Verifique o número e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      {erro && (
        <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">{erro}</AlertDescription>
        </Alert>
      )}

      {resultado && <DetalhesProtocolo denuncia={resultado} />}
    </div>
  )
}
