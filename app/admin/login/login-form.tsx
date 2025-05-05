"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  rememberMe: z.boolean().optional(),
})

export function LoginForm() {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await signIn(values.email, values.password)
      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para o painel administrativo.",
      })
    } catch (error: any) {
      // Capturar mensagem de erro específica
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao fazer login"
      
      let title = "Erro ao fazer login"
      let description = errorMessage
      
      // Personalizar mensagens para erros comuns
      if (errorMessage.includes("Credenciais inválidas")) {
        title = "Credenciais inválidas"
        description = "Email ou senha incorretos. Verifique suas informações e tente novamente."
      } else if (errorMessage.includes("não autorizado como administrador")) {
        title = "Acesso não autorizado"
        description = "Sua conta não possui permissões de administrador."
      } else if (errorMessage.includes("Email não confirmado")) {
        title = "Email não confirmado"
        description = "Por favor, confirme seu email antes de fazer login."
      } else if (errorMessage.includes("Muitas tentativas")) {
        title = "Limite de tentativas excedido"
        description = "Muitas tentativas de login. Tente novamente mais tarde."
      } else if (errorMessage.includes("Erro ao verificar permissões") || 
                errorMessage.includes("Erro ao atualizar perfil")) {
        title = "Erro no servidor"
        description = "Ocorreu um problema no servidor. Tente novamente mais tarde."
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      })
      
      console.error("Erro de login:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Card className="shadow-elevated border border-slate-100 overflow-hidden">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="seu.email@exemplo.com" className="pl-10 h-12" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Senha</FormLabel>
                    <Link href="/admin/recuperar-senha" className="text-sm text-primary hover:underline">
                      Esqueci minha senha
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        className="pl-10 pr-10 h-12"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-base font-normal cursor-pointer">Lembrar de mim</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base" variant="gradient">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    <Toaster />
  )
}
