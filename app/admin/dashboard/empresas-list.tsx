"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Empresa = {
  id: string
  razao_social: string
  cnpj: string
  inscricao_estadual: string | null
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  criado_em: string
  atualizado_em: string
}

export function EmpresasList() {
  const supabase = createClientComponentClient()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    razao_social: "",
    cnpj: "",
    inscricao_estadual: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  })

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('Erro do Supabase:', error.message, error.details, error.hint)
        throw new Error(`Erro ao carregar empresas: ${error.message}`)
      }

      if (!data) {
        console.warn('Nenhum dado retornado do Supabase')
        setEmpresas([])
        return
      }

      setEmpresas(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao carregar empresas:', errorMessage)
      toast({
        title: "Erro ao carregar empresas",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmpresas()
  }, [])

  useEffect(() => {
    if (empresaToDelete) {
      handleDeleteEmpresa()
    }
  }, [empresaToDelete])

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) || 
      empresa.cnpj.includes(searchTerm)
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      id: "",
      razao_social: "",
      cnpj: "",
      inscricao_estadual: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    })
    setIsEditing(false)
  }

  const handleOpenDialog = (empresa?: Empresa) => {
    if (empresa) {
      // Modo edição
      setFormData({
        id: empresa.id,
        razao_social: empresa.razao_social,
        cnpj: empresa.cnpj,
        inscricao_estadual: empresa.inscricao_estadual || "",
        endereco: empresa.endereco,
        numero: empresa.numero,
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        estado: empresa.estado,
        cep: empresa.cep,
      })
      setIsEditing(true)
    } else {
      // Modo criação
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validação básica dos campos obrigatórios
      if (!formData.razao_social.trim()) {
        throw new Error("O campo Razão Social é obrigatório")
      }
      
      if (!formData.cnpj.trim()) {
        throw new Error("O campo CNPJ é obrigatório")
      }

      if (!formData.endereco.trim() || !formData.numero.trim() || !formData.bairro.trim() || 
          !formData.cidade.trim() || !formData.estado.trim() || !formData.cep.trim()) {
        throw new Error("Todos os campos de endereço são obrigatórios")
      }

      // Validar e formatar o CEP (apenas números e limitar a 8 caracteres)
      const cepNumerico = formData.cep.replace(/\D/g, '').substring(0, 8)
      if (cepNumerico.length !== 8) {
        throw new Error("O CEP deve conter 8 dígitos numéricos")
      }

      // Validar e formatar o CNPJ (apenas números)
      const cnpjNumerico = formData.cnpj.replace(/\D/g, '')
      if (cnpjNumerico.length !== 14) {
        throw new Error("O CNPJ deve conter 14 dígitos numéricos")
      }

      if (isEditing) {
        // Modo edição - atualizar empresa existente
        const { error } = await supabase
          .from('empresas')
          .update({
            razao_social: formData.razao_social.trim(),
            cnpj: cnpjNumerico,
            inscricao_estadual: formData.inscricao_estadual?.trim() || null,
            endereco: formData.endereco.trim(),
            numero: formData.numero.trim(),
            bairro: formData.bairro.trim(),
            cidade: formData.cidade.trim(),
            estado: formData.estado.trim().toUpperCase(),
            cep: cepNumerico
            // Removido atualizado_em para evitar erro de hidratação
          })
          .eq('id', formData.id)

        if (error) {
          console.error('Erro do Supabase ao atualizar:', error)
          throw new Error(`Erro ao atualizar empresa: ${error.message}`)
        }

        toast({
          title: "Empresa atualizada com sucesso",
          description: "As informações da empresa foram atualizadas.",
        })
      } else {
        // Modo criação - criar nova empresa
        const { error } = await supabase
          .from('empresas')
          .insert([
            {
              razao_social: formData.razao_social.trim(),
              cnpj: cnpjNumerico,
              inscricao_estadual: formData.inscricao_estadual?.trim() || null,
              endereco: formData.endereco.trim(),
              numero: formData.numero.trim(),
              bairro: formData.bairro.trim(),
              cidade: formData.cidade.trim(),
              estado: formData.estado.trim().toUpperCase(),
              cep: cepNumerico
              // Removido criado_em e atualizado_em para evitar erro de hidratação
              // O banco de dados deve ter valores default para esses campos
            },
          ])

        if (error) {
          console.error('Erro do Supabase ao inserir:', error)
          if (error.code === '23505') {
            throw new Error("CNPJ já cadastrado no sistema")
          }
          throw new Error(`Erro ao cadastrar empresa: ${error.message}`)
        }

        toast({
          title: "Empresa cadastrada com sucesso",
          description: "A empresa foi adicionada à lista de empresas cadastradas.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      
      // Atualizar a lista de empresas
      await fetchEmpresas()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao processar empresa:', errorMessage)
      toast({
        title: isEditing ? "Erro ao atualizar empresa" : "Erro ao cadastrar empresa",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmpresa = async () => {
    if (!empresaToDelete) return

    try {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', empresaToDelete.id)

      if (error) throw error

      toast({
        title: "Empresa excluída com sucesso",
        description: "A empresa foi removida da lista de empresas cadastradas.",
      })

      // Atualizar a lista de empresas
      await fetchEmpresas()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao excluir empresa:', errorMessage)
      toast({
        title: "Erro ao excluir empresa",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setEmpresaToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>Gerencie as empresas que podem receber denúncias.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Empresa" : "Cadastrar Nova Empresa"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Atualize os dados da empresa selecionada." 
                  : "Preencha os dados da empresa para cadastrá-la no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="razao_social">Razão Social*</Label>
                    <Input
                      id="razao_social"
                      name="razao_social"
                      value={formData.razao_social}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ*</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="00000000000000"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricao_estadual"
                    name="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="endereco">Endereço*</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero">Número*</Label>
                    <Input
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bairro">Bairro*</Label>
                    <Input
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cidade">Cidade*</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="estado">Estado (UF)*</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP*</Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="00000000"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Atualizando..." : "Salvando..."}
                    </>
                  ) : (
                    isEditing ? "Atualizar Empresa" : "Salvar Empresa"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    Carregando empresas...
                  </TableCell>
                </TableRow>
              ) : filteredEmpresas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.razao_social}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">{empresa.cidade}/{empresa.estado}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {empresa.endereco}, {empresa.numero}, {empresa.bairro}, CEP {empresa.cep}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(empresa)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a empresa {empresa.razao_social}?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setEmpresaToDelete(empresa);
                                }}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
