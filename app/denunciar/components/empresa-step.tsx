"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  empresa: z.string({
    required_error: "Selecione a empresa.",
  }),
})

interface EmpresaStepProps {
  onNext: (data: { empresa: string }) => void
}

export function EmpresaStep({ onNext }: EmpresaStepProps) {
  const supabase = createClientComponentClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [empresaEncontrada, setEmpresaEncontrada] = useState<{ id: string; razao_social: string; cnpj: string } | null>(null)
  const [mensagemErro, setMensagemErro] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: "",
    },
  })

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    setMensagemErro("")
    
    if (value.trim().length < 3) {
      setEmpresaEncontrada(null)
      form.setValue("empresa", "")
      return
    }

    setIsSearching(true)

    try {
      // Buscar por CNPJ (removendo caracteres especiais)
      const cnpjNumerico = value.replace(/\D/g, '')
      
      let query = supabase
        .from('empresas')
        .select('id, razao_social, cnpj')
      
      // Se parece com CNPJ (tem números)
      if (cnpjNumerico.length > 0) {
        query = query.ilike('cnpj', `%${cnpjNumerico}%`)
      } else {
        // Busca por nome
        query = query.ilike('razao_social', `%${value}%`)
      }
      
      const { data, error } = await query.limit(1)

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        setEmpresaEncontrada(data[0])
        form.setValue("empresa", data[0].id)
      } else {
        setEmpresaEncontrada(null)
        form.setValue("empresa", "")
        setMensagemErro("Empresa não encontrada. Verifique o nome ou CNPJ digitado.")
      }
    } catch (error) {
      console.error("Erro ao buscar empresa:", error)
      setEmpresaEncontrada(null)
      form.setValue("empresa", "")
      setMensagemErro("Ocorreu um erro ao buscar a empresa. Tente novamente.")
    } finally {
      setIsSearching(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!empresaEncontrada) {
      form.setError("empresa", {
        type: "manual",
        message: "Selecione uma empresa válida para continuar.",
      })
      return
    }
    onNext(values)
  }

  return (
    <Card className="shadow-elevated border border-slate-100 overflow-hidden">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Selecione a empresa</h2>
            <p className="text-muted-foreground">Digite o nome ou CNPJ da empresa relacionada à sua denúncia.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nome da empresa ou CNPJ</FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Digite o nome ou CNPJ da empresa..."
                        className="pl-10 h-12 rounded-md"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground animate-spin" />
                      )}
                    </div>
                    
                    {mensagemErro && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{mensagemErro}</p>
                          <p className="mt-1">
                            Se sua empresa não está cadastrada, entre em contato conosco para saber como se tornar um parceiro.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {empresaEncontrada && (
                      <div 
                        className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 flex items-center cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => {
                          form.setValue("empresa", empresaEncontrada.id)
                          setSearchTerm(empresaEncontrada.razao_social)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          Empresa encontrada: <strong>{empresaEncontrada.razao_social}</strong> 
                          <span className="text-xs ml-1">({empresaEncontrada.cnpj})</span>
                        </span>
                      </div>
                    )}
                    
                    {!searchTerm && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Digite o nome ou CNPJ da empresa para verificar se está cadastrada em nossa plataforma.
                      </p>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="h-12 px-8 rounded-full"
                  disabled={!empresaEncontrada || isSearching}
                >
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
