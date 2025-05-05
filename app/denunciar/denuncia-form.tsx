"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2, Upload, Info, CheckCircle, File } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for companies
const empresas = [
  { id: "1", nome: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90" },
  { id: "2", nome: "XYZ Serviços S.A.", cnpj: "98.765.432/0001-10" },
  { id: "3", nome: "Indústrias 123 Ltda", cnpj: "45.678.901/0001-23" },
]

const formSchema = z.object({
  empresa: z.string({
    required_error: "Selecione a empresa.",
  }),
  titulo: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres.",
  }),
  descricao: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres.",
  }),
  anonimo: z.boolean().default(false),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal("")),
  anexos: z.any().optional(),
})

export function DenunciaForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileCount, setFileCount] = useState(0)
  const [fileNames, setFileNames] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: "",
      titulo: "",
      descricao: "",
      anonimo: false,
      email: "",
      anexos: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random protocol number
      const protocolo = Math.random().toString(36).substring(2, 10).toUpperCase()
      const dataHora = new Date().toLocaleString("pt-BR")

      // Redirect to success page with protocol
      router.push(`/denunciar/sucesso?protocolo=${protocolo}&dataHora=${encodeURIComponent(dataHora)}`)
    } catch (error) {
      toast({
        title: "Erro ao enviar denúncia",
        description: "Ocorreu um erro ao processar sua denúncia. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setFileCount(files.length)
      setFileNames(files.map((file) => file.name))
      form.setValue("anexos", e.target.files)
    }
  }

  return (
    <Card className="shadow-elevated border border-slate-100 overflow-hidden">
      <div className="bg-primary/5 px-8 py-4 border-b border-slate-100">
        <div className="flex items-center text-primary">
          <Info className="mr-2 h-5 w-5" />
          <span className="font-medium">As informações são tratadas com confidencialidade</span>
        </div>
      </div>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nome da Empresa*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[280px]">
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.id} className="py-3">
                              {empresa.nome} ({empresa.cnpj})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Selecione a empresa relacionada à sua denúncia</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anonimo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <FormLabel className="text-base m-0">Identificação</FormLabel>
                        <div className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2.5 text-xs font-medium text-primary">
                          Opcional
                        </div>
                      </div>
                      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base">Enviar anonimamente</FormLabel>
                          <FormDescription>Se marcado, sua identidade não será revelada à empresa</FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Título da denúncia*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Assédio moral no departamento de vendas" className="h-12" {...field} />
                    </FormControl>
                    <FormDescription>Um título breve e claro sobre o assunto da denúncia</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Descrição detalhada*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva em detalhes o ocorrido, incluindo datas, locais e pessoas envolvidas."
                        className="min-h-[180px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Inclua o máximo de detalhes relevantes para facilitar a análise</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anexos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Anexos (opcional)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("file-upload")?.click()}
                            className="h-12"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Selecionar arquivos
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {fileCount ? `${fileCount} arquivo(s) selecionado(s)` : "Nenhum arquivo selecionado"}
                          </span>
                        </div>

                        {fileNames.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {fileNames.map((name, index) => (
                              <div key={index} className="flex items-center rounded-md bg-muted/50 p-2 text-sm">
                                <File className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="flex-1 truncate">{name}</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Você pode anexar documentos, imagens ou outros arquivos relevantes (máx. 10MB por arquivo)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <FormLabel className="text-base m-0">Email para notificações</FormLabel>
                      <div className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2.5 text-xs font-medium text-primary">
                        Opcional
                      </div>
                    </div>
                    <FormControl>
                      <Input type="email" placeholder="seu.email@exemplo.com" className="h-12" {...field} />
                    </FormControl>
                    <FormDescription>
                      Você receberá notificações sobre o status da sua denúncia. Este email não será vinculado ao seu
                      protocolo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms acceptance */}
              <div className="rounded-md border border-primary/10 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm mb-2">
                      Ao enviar este formulário, você concorda com nossa{" "}
                      <a href="/privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>{" "}
                      e{" "}
                      <a href="/termos" className="text-primary hover:underline">
                        Termos de Uso
                      </a>
                      .
                    </p>
                    <p className="text-sm">
                      Suas informações serão tratadas com confidencialidade e segurança de acordo com a Lei Geral de
                      Proteção de Dados (LGPD).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Button type="button" variant="outline" className="h-12 text-base">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="gradient"
                  className={cn("h-12 text-base min-w-[160px]", isSubmitting ? "opacity-80" : "")}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Denúncia"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
