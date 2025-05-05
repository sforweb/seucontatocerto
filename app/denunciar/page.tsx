"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProgressSteps } from "./components/progress-steps"
import { EmpresaStep } from "./components/empresa-step"
import { DenunciaStep } from "./components/denuncia-step"
import { ProtocoloStep } from "./components/protocolo-step"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

const steps = [
  { id: 1, label: "Empresa" },
  { id: 2, label: "Denúncia" },
  { id: 3, label: "Protocolo" },
]

export default function DenunciarPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    empresa: "",
    titulo: "",
    descricao: "",
    anonimo: false,
    nome_denunciante: "",
    email: "",
    anexos: undefined as FileList | undefined,
    protocolo: "",
    dataHora: "",
  })

  const supabase = createClientComponentClient()

  const handleEmpresaSubmit = (data: { empresa: string }) => {
    setFormData({ ...formData, ...data })
    setCurrentStep(2)
  }

  const handleDenunciaSubmit = async (data: {
    titulo: string
    descricao: string
    anonimo: boolean
    nome_denunciante?: string
    email?: string
    anexos?: FileList
  }) => {
    setIsSubmitting(true)
    
    try {
      // Gerar um protocolo aleatório com maior segurança
      // Combinando timestamp, UUID parcial e caracteres aleatórios
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removidos caracteres ambíguos
      let extraChars = '';
      for (let i = 0; i < 3; i++) {
        extraChars += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      
      // Formato: DEN + 3 caracteres aleatórios + timestamp parcial + random
      const protocolo = `DEN${extraChars}${timestamp.substring(timestamp.length - 3)}${randomPart}`;
      const dataHora = new Date().toISOString()
      
      // Verificar se o protocolo já existe (extremamente improvável, mas por segurança)
      const { data: protocoloExistente } = await supabase
        .from('denuncias')
        .select('protocolo')
        .eq('protocolo', protocolo)
        .single();
        
      // Se por algum motivo extremamente improvável o protocolo já existir, gerar outro
      if (protocoloExistente) {
        throw new Error("Erro ao gerar protocolo único. Por favor, tente novamente.");
      }
      
      // Preparar dados para salvar
      const denunciaData = {
        empresa_id: formData.empresa,
        protocolo,
        titulo: data.titulo,
        descricao: data.descricao,
        anonima: data.anonimo,
        nome_denunciante: data.anonimo ? null : data.nome_denunciante || null,
        email_notificacao: data.anonimo ? null : data.email || null,
        estado: 'pendente',
        criada_em: dataHora,
        atualizada_em: dataHora
      }

      // Inserir denúncia
      const { data: denunciaInserida, error } = await supabase
        .from('denuncias')
        .insert(denunciaData)
        .select('id')
        .single()

      if (error) {
        throw new Error(`Erro ao registrar denúncia: ${error.message}`)
      }

      // Se tem anexos, fazer upload e salvar referências
      if (data.anexos && data.anexos.length > 0) {
        const denunciaId = denunciaInserida.id
        
        // Processar cada arquivo
        for (let i = 0; i < data.anexos.length; i++) {
          const file = data.anexos[i]
          
          // Verificar tamanho (máximo 2MB)
          if (file.size > 2 * 1024 * 1024) {
            console.warn(`Arquivo ${file.name} excede o limite de 2MB e será ignorado`)
            continue
          }
          
          // Gerar nome único para o arquivo
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
          const filePath = `anexos/${denunciaId}/${fileName}`
          
          // Upload do arquivo para o storage
          const { error: uploadError } = await supabase
            .storage
            .from('anexos')
            .upload(filePath, file)
            
          if (uploadError) {
            console.error(`Erro ao fazer upload do arquivo ${file.name}:`, uploadError)
            continue
          }
          
          // Obter URL pública do arquivo
          const { data: urlData } = await supabase
            .storage
            .from('anexos')
            .getPublicUrl(filePath)
            
          // Registrar anexo no banco de dados
          await supabase
            .from('anexos')
            .insert({
              tipo_pai: 'denuncia',
              pai_id: denunciaId,
              url_arquivo: urlData.publicUrl,
              nome_arquivo: file.name,
              mime_type: file.type
            })
        }
      }

      // Atualizar estado do formulário
      setFormData({
        ...formData,
        ...data,
        protocolo,
        dataHora: new Date().toLocaleString("pt-BR"),
      })

      // Avançar para o passo de protocolo
      setCurrentStep(3)
    } catch (error) {
      console.error('Erro ao processar denúncia:', error)
      toast({
        title: "Erro ao registrar denúncia",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua denúncia. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

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

          <div className="space-y-2 mb-10 text-center">
            <h1 className="text-3xl font-semibold md:text-4xl">Registrar Denúncia</h1>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário abaixo para registrar sua denúncia. Todas as informações são tratadas com
              confidencialidade.
            </p>
          </div>

          <ProgressSteps currentStep={currentStep} steps={steps} />

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-10 left-0 w-40 h-40 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10"></div>

            {currentStep === 1 && <EmpresaStep onNext={handleEmpresaSubmit} />}

            {currentStep === 2 && (
              <DenunciaStep 
                onNext={handleDenunciaSubmit} 
                onBack={handleBack} 
                empresaId={formData.empresa}
                isSubmitting={isSubmitting}
              />
            )}

            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-lg">
                <ProtocoloStep protocolo={formData.protocolo} dataHora={formData.dataHora} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
