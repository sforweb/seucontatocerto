import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle, Shield, Lock, MessageSquare, Clock, ChevronRight, ArrowRight, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcff]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-28 md:pb-40">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[#fafbff] bg-dot-pattern opacity-30 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white -z-10"></div>

          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center rounded-full border bg-light/50 px-4 py-1.5 mb-6 text-sm font-medium text-primary">
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                <span>Conforme a Norma Regulamentadora Número 1 (NR-1)</span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Canal seguro e independente <br className="hidden sm:inline" />
                <span className="gradient-text">para a voz do colaborador</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Registre suas insatisfações de forma segura, anônima e acompanhe o feedback da empresa. Garantimos
                transparência e confidencialidade em todo o processo.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/denunciar"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-base font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Registre aqui a sua insatisfação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/consultar"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/5 hover:border-primary/50 text-base font-medium px-8 py-3 transition-all duration-300 w-full sm:w-auto"
                >
                  Consultar Protocolo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-16 relative z-10">
                <div className="absolute inset-x-0 -top-6 h-24 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 blur-3xl -z-10 opacity-70"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center p-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">Seguro</h3>
                      <p className="text-xs text-muted-foreground">Proteção de dados com criptografia avançada</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center p-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">Anônimo</h3>
                      <p className="text-xs text-muted-foreground">Identidade protegida e não rastreável</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center p-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform duration-300">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">Confidencial</h3>
                      <p className="text-xs text-muted-foreground">Acesso restrito apenas a pessoas autorizadas</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center text-center p-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform duration-300">
                        <FileCheck className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">Conforme LGPD</h3>
                      <p className="text-xs text-muted-foreground">
                        Em conformidade com a Lei Geral de Proteção de Dados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero visual element */}
            <div className="relative mt-16 md:mt-24">
              {/* Background decorative elements */}
              <div className="absolute -top-40 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -z-10 opacity-70"></div>
              <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl -z-10 opacity-60"></div>

              <div className="relative mx-auto max-w-5xl">
                {/* Main visual element */}
                <div className="relative rounded-2xl bg-gradient-to-r from-primary/[0.03] to-secondary/[0.07] border border-slate-100/80 shadow-elevated overflow-hidden p-8 md:p-12">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="order-2 md:order-1">
                      <h3 className="text-2xl font-semibold mb-4">Canal seguro para comunicação</h3>
                      <p className="text-muted-foreground mb-6">
                        Nossa plataforma oferece um ambiente protegido onde colaboradores podem expressar preocupações
                        sem medo de retaliação, garantindo total confidencialidade e conformidade com a legislação.
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Processo simplificado em 3 etapas</p>
                            <p className="text-xs text-muted-foreground">Registre, receba protocolo e acompanhe</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Acompanhamento transparente</p>
                            <p className="text-xs text-muted-foreground">Visualize o status e feedback em tempo real</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Proteção de identidade</p>
                            <p className="text-xs text-muted-foreground">
                              Opção de anonimato com criptografia avançada
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="order-1 md:order-2 flex justify-center">
                      <div className="relative">
                        {/* Abstract visual representation */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 blur-2xl opacity-30"></div>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-white bg-light/80 shadow-lg flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-secondary/10"></div>
                            <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-sm flex items-center justify-center">
                              <Shield className="h-12 w-12 text-primary" />
                            </div>
                          </div>

                          {/* Orbiting elements */}
                          <div className="absolute top-5 right-5 animate-float">
                            <div className="h-12 w-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                              <Lock className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          <div className="absolute bottom-10 left-0 animate-float" style={{ animationDelay: "1s" }}>
                            <div className="h-12 w-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                              <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          <div className="absolute bottom-0 right-16 animate-float" style={{ animationDelay: "2s" }}>
                            <div className="h-12 w-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                              <FileCheck className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-white relative overflow-hidden">
          {/* Elementos decorativos de fundo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl -z-10 opacity-40"></div>
          <div className="absolute top-40 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl -z-10"></div>
          <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-secondary/5 rounded-full blur-xl -z-10"></div>

          <div className="container">
            <div className="text-center mb-20">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 mb-4 text-sm font-medium text-primary">
                <span>Experiência Premium</span>
              </div>
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                Benefícios do nosso <span className="gradient-text">canal de denúncias</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Nossa plataforma foi projetada para garantir segurança, transparência e facilidade de uso para todos os
                colaboradores.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 - Anonimato */}
              <div className="group relative bg-white rounded-2xl transition-all duration-500 hover:translate-y-[-8px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] rounded-bl-3xl rounded-tr-2xl -z-10"></div>

                  <div className="mb-6 relative">
                    <div className="absolute -inset-3 rounded-xl bg-primary/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/90 group-hover:text-white transition-all duration-500">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    Anonimato Opcional
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    Escolha se identificar ou permanecer anônimo. Sua privacidade está garantida em todos os momentos
                    com nossa tecnologia avançada de proteção de identidade.
                  </p>

                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    <span className="group-hover:mr-2 transition-all">Saiba mais</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>

              {/* Card 2 - Segurança */}
              <div className="group relative bg-white rounded-2xl transition-all duration-500 hover:translate-y-[-8px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] rounded-bl-3xl rounded-tr-2xl -z-10"></div>

                  <div className="mb-6 relative">
                    <div className="absolute -inset-3 rounded-xl bg-primary/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/90 group-hover:text-white transition-all duration-500">
                      <Lock className="h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    Segurança Total
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    Dados criptografados e protegidos com os mais altos padrões de segurança e conformidade com a LGPD,
                    garantindo proteção completa das informações.
                  </p>

                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    <span className="group-hover:mr-2 transition-all">Saiba mais</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>

              {/* Card 3 - Transparência */}
              <div className="group relative bg-white rounded-2xl transition-all duration-500 hover:translate-y-[-8px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] rounded-bl-3xl rounded-tr-2xl -z-10"></div>

                  <div className="mb-6 relative">
                    <div className="absolute -inset-3 rounded-xl bg-primary/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/90 group-hover:text-white transition-all duration-500">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    Transparência
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    Acompanhe o status da sua denúncia e receba feedback da empresa através do sistema de protocolos com
                    atualizações em tempo real.
                  </p>

                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    <span className="group-hover:mr-2 transition-all">Saiba mais</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>

              {/* Card 4 - Facilidade */}
              <div className="group relative bg-white rounded-2xl transition-all duration-500 hover:translate-y-[-8px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.07] rounded-bl-3xl rounded-tr-2xl -z-10"></div>

                  <div className="mb-6 relative">
                    <div className="absolute -inset-3 rounded-xl bg-primary/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/90 group-hover:text-white transition-all duration-500">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    Facilidade de Uso
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    Interface intuitiva e processo simplificado para registrar e acompanhar sua denúncia sem
                    complicações, com suporte em todas as etapas.
                  </p>

                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    <span className="group-hover:mr-2 transition-all">Saiba mais</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Background especial para esta seção */}
          <div className="absolute inset-0 bg-gradient-to-b from-light/80 via-light/40 to-white"></div>
          <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] opacity-[0.15]"></div>

          {/* Elementos decorativos */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 mb-4 text-sm font-medium text-primary">
                <span>Processo Intuitivo</span>
              </div>
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                Como <span className="gradient-text">funciona</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Nosso processo foi desenhado para ser simples, seguro e eficiente do início ao fim, garantindo a melhor
                experiência para todos os envolvidos.
              </p>
            </div>

            {/* Timeline horizontal com cards interativos */}
            <div className="relative mt-20">
              {/* Linha de conexão */}
              <div className="absolute top-[4.5rem] left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                {/* Etapa 1 */}
                <div className="relative group">
                  {/* Indicador de etapa */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-white shadow-lg"></div>
                      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-primary/5 to-secondary/10"></div>
                      <div className="absolute inset-[6px] rounded-full bg-white"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">01</span>
                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-secondary rounded-full mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card de conteúdo */}
                  <div className="relative mt-16 bg-white rounded-2xl transition-all duration-500 group-hover:translate-y-[-8px]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                    <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          Registre sua denúncia
                        </h3>
                        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          Preencha o formulário com os detalhes da sua insatisfação e escolha se identificar ou não.
                          Você pode anexar evidências para fortalecer seu relato.
                        </p>

                        {/* Detalhes extras que aparecem no hover */}
                        <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                          <ul className="space-y-2 text-sm text-left">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Formulário intuitivo e seguro</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Opção de anonimato garantida</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Suporte para anexar evidências</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etapa 2 */}
                <div className="relative group">
                  {/* Indicador de etapa */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-white shadow-lg"></div>
                      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-primary/5 to-secondary/10"></div>
                      <div className="absolute inset-[6px] rounded-full bg-white"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">02</span>
                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-secondary rounded-full mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card de conteúdo */}
                  <div className="relative mt-16 bg-white rounded-2xl transition-all duration-500 group-hover:translate-y-[-8px]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                    <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          Receba seu protocolo
                        </h3>
                        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          Após o envio, você receberá um número de protocolo único para acompanhamento. Guarde-o com
                          segurança para futuras consultas.
                        </p>

                        {/* Detalhes extras que aparecem no hover */}
                        <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                          <ul className="space-y-2 text-sm text-left">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Protocolo único e criptografado</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Confirmação por email (opcional)</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Acesso seguro às informações</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etapa 3 */}
                <div className="relative group">
                  {/* Indicador de etapa */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-white shadow-lg"></div>
                      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-primary/5 to-secondary/10"></div>
                      <div className="absolute inset-[6px] rounded-full bg-white"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">03</span>
                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-secondary rounded-full mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card de conteúdo */}
                  <div className="relative mt-16 bg-white rounded-2xl transition-all duration-500 group-hover:translate-y-[-8px]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>

                    <div className="relative p-8 border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          Acompanhe o feedback
                        </h3>
                        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          Use seu protocolo para consultar o status e a resposta da empresa à sua denúncia. Você será
                          notificado sobre atualizações importantes.
                        </p>

                        {/* Detalhes extras que aparecem no hover */}
                        <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                          <ul className="space-y-2 text-sm text-left">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Atualizações em tempo real</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Comunicação bidirecional segura</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="ml-2 text-muted-foreground">Notificações por email (opcional)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ilustração decorativa */}

            {/* Seção "Pronto para começar" com layout lado a lado */}

            <div className="relative mt-24 py-16">
              {/* Elementos decorativos de fundo */}
              <div className="absolute -top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -z-10 opacity-50"></div>
              <div className="absolute -bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl -z-10 opacity-40"></div>

              {/* Linha decorativa superior */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

              {/* Linha decorativa inferior */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>

              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">
                  {/* Coluna de texto - Lado esquerdo */}
                  <div className="relative">
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>

                    <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-6">
                      Pronto para <span className="gradient-text">começar?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                      Nossa plataforma oferece um canal seguro e eficiente para registrar denúncias, garantindo total
                      confidencialidade e conformidade com a legislação.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Processo simplificado em 3 etapas</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Acompanhamento transparente do status</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Proteção de identidade garantida</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Link
                        href="/denunciar"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-base font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Registre sua denúncia
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>

                      {/* Elemento decorativo */}
                      <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full border border-primary/20 opacity-70"></div>
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full border border-secondary/10 opacity-50"></div>
                    </div>
                  </div>

                  {/* Ilustração - Lado direito */}
                  <div className="relative flex justify-center items-center">
                    {/* Imagem fornecida */}
                    <div className="relative w-full max-w-md">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustracao3-jEbVyUFWiwi3eTzkyXddrIEYIl5R25.png"
                        alt="Pessoa trabalhando em um laptop com processo de denúncia e elementos de segurança"
                        className="w-[400px] h-auto"
                      />
                      
                      {/* Elementos decorativos */}
                      <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full border border-primary/20 animate-pulse-slow"></div>
                      <div
                        className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-secondary/5 animate-pulse-slow"
                        style={{ animationDelay: "1s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 mb-4 text-sm font-medium text-primary">
                <span>Confiável</span>
              </div>
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                Empresas que <span className="gradient-text">confiam em nós</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Inúmeras empresas utilizam nossa plataforma para manter um canal de comunicação seguro com seus
                colaboradores.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="h-16 w-36 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">LOGO {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-12 gap-6">
                {/* Depoimento 1 - Grande */}
                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.05] p-8 rounded-xl border border-slate-100 shadow-card">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 text-lg">
                    "A implementação do Canal de Denúncias trouxe mais transparência e confiança para nossos
                    colaboradores. O processo é simples e a plataforma é extremamente segura."
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mr-3">
                      SC
                    </div>
                    <div>
                      <h4 className="font-semibold">Alexandre Spada</h4>
                      <p className="text-sm text-muted-foreground">CEO - SFORWEB Digital Solutions</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 2 - Pequeno */}
                <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.04] p-6 rounded-xl border border-slate-100 shadow-card">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5">
                    "Este poderoso sistema elimina a necessidade de processos manuais, permitindo que eu crie relatórios
                    detalhados e obtenha aprovação em minutos."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold mr-3">
                      JB
                    </div>
                    <div>
                      <h4 className="font-semibold">Jason Barella</h4>
                      <p className="text-sm text-muted-foreground">Gerente de RH</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 3 - Pequeno */}
                <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.04] p-6 rounded-xl border border-slate-100 shadow-card">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5">
                    "Procurávamos fornecedores que cumprissem as regulamentações vigentes. Esta plataforma é simplesmente
                    funcional!"
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-3">
                      SE
                    </div>
                    <div>
                      <h4 className="font-semibold">Manuela Rodrigues</h4>
                      <p className="text-sm text-muted-foreground">Diretora de Compliance</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 4 - Grande */}
                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.05] p-8 rounded-xl border border-slate-100 shadow-card">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 text-lg">
                    "Estamos baseados na Europa e as últimas regulamentações de proteção de dados exigem canais de
                    denúncia seguros. Esta plataforma atende perfeitamente às nossas necessidades."
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg mr-3">
                      AY
                    </div>
                    <div>
                      <h4 className="font-semibold">Anna Yon</h4>
                      <p className="text-sm text-muted-foreground">CEO - TechEurope</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 5 - Pequeno */}
                <div className="col-span-12 md:col-span-6 lg:col-span-6 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.04] p-6 rounded-xl border border-slate-100 shadow-card">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5">
                    "Antes gastávamos muito tempo com trabalho administrativo, agora podemos focar em ajudar nossos
                    colaboradores com um canal de comunicação eficiente e seguro."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-3">
                      EH
                    </div>
                    <div>
                      <h4 className="font-semibold">Ederson Hani</h4>
                      <p className="text-sm text-muted-foreground">Diretor de Operações</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Design Fluido e Aberto */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-[#f8faff] to-white">
          {/* Elementos decorativos de fundo */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[80px] -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] -z-10"></div>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25px 25px, rgba(16, 92, 198, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(70, 178, 255, 0.2) 2%, transparent 0%)",
                backgroundSize: "100px 100px",
              }}
            ></div>
          </div>

          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Coluna de conteúdo - Lado esquerdo */}
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>

                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1.5"
                  >
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 12L10.58 14.83L16.25 9.17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Conforme a NR-1 e LGPD</span>
                </div>

                <h2 className="text-3xl font-semibold md:text-4xl mb-6">
                  Transforme sua empresa com um{" "}
                  <span className="relative">
                    <span className="relative z-10">canal de denúncias</span>
                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-secondary/20 -z-10 skew-x-3"></span>
                  </span>{" "}
                  de alto padrão
                </h2>

                <p className="text-lg text-muted-foreground mb-8">
                  Ofereça aos seus colaboradores uma voz segura e confidencial. Nossa plataforma atende às exigências
                  legais e proporciona um ambiente de trabalho mais transparente e ético.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 12H16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Implementação rápida</p>
                      <p className="text-sm text-muted-foreground">Plataforma pronta em até 48 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 10.5L12 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16V16.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Suporte especializado</p>
                      <p className="text-sm text-muted-foreground">Atendimento 24/7 para sua empresa</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 7V12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Relatórios analíticos</p>
                      <p className="text-sm text-muted-foreground">Dashboards personalizados e insights</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.64 20.59 3.09 16.01 3.09 11.12V6.73C3.09 5.91 3.71 4.98 4.48 4.67L10.05 2.39C11.3 1.88 12.71 1.88 13.96 2.39L19.52 4.67C20.29 4.98 20.92 5.91 20.92 6.73V11.12H20.91Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 12.5V15.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Segurança total</p>
                      <p className="text-sm text-muted-foreground">Criptografia e proteção de dados</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/cadastro"
                    className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-base font-medium px-8 py-3.5 overflow-hidden group"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                    <span className="relative flex items-center">
                      Cadastrar Empresa
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2"
                      >
                        <path
                          d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.5 12H20.33"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>

                  <Link
                    href="/contato"
                    className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white hover:border-primary/30 hover:bg-primary/5 text-slate-800 text-base font-medium px-8 py-3.5 transition-colors"
                  >
                    <span>Falar com Consultor</span>
                  </Link>
                </div>
              </div>

              {/* Coluna de imagem - Lado direito */}
              <div className="relative flex justify-center items-center">
                {/* Imagem principal */}
                <div className="relative w-full max-w-xl">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustracao2-aFZEsbmKVKuXFkjiSojmbFpnkrNgiO.png"
                    alt="Plataforma de denúncias com análise de dados e suporte"
                    className="w-full h-auto"
                  />

                  {/* Elementos decorativos */}
                  <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full border border-primary/20 animate-pulse-slow"></div>
                  <div
                    className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full border border-secondary/20 animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  {/* Destaque para elementos chave */}
                  <div className="absolute top-[5%] left-[15%] w-16 h-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary font-bold text-xs">
                      48h
                    </div>
                  </div>

                  <div className="absolute bottom-[15%] right-[10%] w-16 h-16 rounded-full border-2 border-dashed border-secondary/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-secondary"
                      >
                        <path
                          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 7V12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
