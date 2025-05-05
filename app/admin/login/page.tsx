import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginForm } from "./login-form"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcff] page-fade-in">
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left side with image */}
        <div className="hidden lg:block lg:w-1/2 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-4/5 max-w-md h-auto">
              <Image 
                src="/images/login-security.png" 
                alt="Segurança e privacidade no acesso" 
                width={600}
                height={600}
                className="object-contain" 
                priority
              />
            </div>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para página inicial
            </Link>

            <div className="space-y-2 mb-10">
              <h1 className="text-3xl font-semibold md:text-4xl">Área Administrativa</h1>
              <p className="text-lg text-muted-foreground">Faça login para acessar o painel administrativo.</p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Não tem acesso? Entre em contato com o{" "}
              <Link href="/contato" className="font-medium text-primary hover:underline">
                administrador do sistema
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
