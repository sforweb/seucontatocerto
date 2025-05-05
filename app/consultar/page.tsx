import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ConsultaProtocoloForm } from "./components/consulta-protocolo-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConsultarProtocoloPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcff] page-fade-in">
      <Navbar />
      <main className="flex-1 bg-light/40 py-16">
        <div className="container max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para página inicial
          </Link>

          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-semibold md:text-4xl">Consultar Protocolo</h1>
            <p className="text-lg text-muted-foreground">
              Digite o número do protocolo para verificar o status da sua denúncia e o feedback da empresa.
            </p>
          </div>

          <div className="relative">
            {/* Elementos decorativos */}
            <div className="absolute -top-10 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-10 left-0 w-40 h-40 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10"></div>

            <ConsultaProtocoloForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
