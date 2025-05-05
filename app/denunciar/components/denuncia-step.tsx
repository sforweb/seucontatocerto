"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, File, CheckCircle } from "lucide-react"

const formSchema = z.object({
  titulo: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres.",
  }),
  descricao: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres.",
  }),
  anonimo: z.boolean().default(false),
  nome_denunciante: z.string().optional().or(z.literal("")),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal("")),
  anexos: z.any().optional(),
})

interface DenunciaStepProps {
  onNext: (data: z.infer<typeof formSchema>) => void
  onBack: () => void
  empresaId: string
  isSubmitting?: boolean
}

export function DenunciaStep({ onNext, onBack, empresaId, isSubmitting = false }: DenunciaStepProps) {
  const [fileCount, setFileCount] = useState(0)
  const [fileNames, setFileNames] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      anonimo: false,
      nome_denunciante: "",
      email: "",
      anexos: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onNext(values)
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
      <CardContent className="p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Detalhes da denúncia</h2>
            <p className="text-muted-foreground">
              Preencha os detalhes da sua denúncia. Forneça o máximo de informações possível.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Título da denúncia</FormLabel>
                    <FormControl>
                      <Input placeholder="Resumo breve da sua denúncia" className="h-12 rounded-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Descrição detalhada</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva em detalhes o ocorrido, incluindo informações como datas, locais, pessoas envolvidas e evidências..."
                        className="min-h-[180px] resize-y rounded-md"
                        {...field}
                      />
                    </FormControl>
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
                        <div className="border-2 border-dashed border-slate-200 rounded-md p-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">Clique para anexar arquivos ou arraste e solte aqui</p>
                            <p className="text-xs text-muted-foreground">(PDF, JPG, PNG - máx. 2MB por arquivo)</p>
                            <Input
                              type="file"
                              multiple
                              className="hidden"
                              id="file-upload"
                              onChange={handleFileChange}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("file-upload")?.click()}
                              className="mt-2 rounded-full"
                            >
                              Selecionar arquivos
                            </Button>
                          </div>
                        </div>

                        {fileNames.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {fileNames.map((name, index) => (
                              <div key={index} className="flex items-center rounded-full bg-muted/50 p-2 text-sm">
                                <File className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="flex-1 truncate">{name}</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonimo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (checked) {
                            form.setValue("nome_denunciante", "")
                            form.setValue("email", "")
                          }
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base">Enviar anonimamente</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Se marcado, sua identidade não será revelada à empresa
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("anonimo") && (
                <>
                  <FormField
                    control={form.control}
                    name="nome_denunciante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nome (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" className="h-12 rounded-md" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground mt-1">
                          Seu nome será visível apenas para a empresa responsável pela análise da denúncia.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">E-mail para contato (opcional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" className="h-12 rounded-md" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground mt-1">
                          Este e-mail será usado apenas para notificá-lo sobre atualizações.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8 rounded-full" disabled={isSubmitting}>
                  Voltar
                </Button>
                <Button type="submit" className="h-12 px-8 rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar denúncia"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
