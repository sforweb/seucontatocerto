import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-light/60 pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold gradient-text">Canal de Denúncias</span>
            </div>
            <p className="text-muted-foreground">
              Plataforma segura e independente para a voz do colaborador. Registre suas insatisfações com total
              confidencialidade.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="font-semibold text-foreground">Links Rápidos</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/denunciar" className="text-muted-foreground hover:text-primary transition-colors">
                Registrar Denúncia
              </Link>
              <Link href="/consultar" className="text-muted-foreground hover:text-primary transition-colors">
                Consultar Protocolo
              </Link>
              <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
                Área Administrativa
              </Link>
            </nav>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="font-semibold text-foreground">Institucional</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/sobre" className="text-muted-foreground hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                Perguntas Frequentes
              </Link>
              <Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/lei-geral" className="text-muted-foreground hover:text-primary transition-colors">
                LGPD
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-muted/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Canal de Denúncias. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/termos" className="hover:text-primary transition-colors">
                Termos
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link href="/privacidade" className="hover:text-primary transition-colors">
                Privacidade
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
