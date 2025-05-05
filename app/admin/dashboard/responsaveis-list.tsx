"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Responsavel = {
  id: string
  empresa_id: string
  nome: string
  email: string
  telefone: string | null
  papel: string | null
  criado_em: string
  notas: string | null
}

type Empresa = {
  id: string
  razao_social: string
}

export function ResponsaveisList() {
  const supabase = createClientComponentClient()
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [responsavelToDelete, setResponsavelToDelete] = useState<Responsavel | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    empresa_id: "",
    nome: "",
    email: "",
    telefone: "",
    papel: "",
    notas: ""
  })

  const fetchResponsaveis = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('responsaveis_empresas')
        .select('*, empresas(id, razao_social)')
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('Erro do Supabase:', error.message, error.details, error.hint)
        throw new Error(`Erro ao carregar responsáveis: ${error.message}`)
      }

      if (!data) {
        console.warn('Nenhum dado retornado do Supabase')
        setResponsaveis([])
        return
      }

      setResponsaveis(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao carregar responsáveis:', errorMessage)
      toast({
        title: "Erro ao carregar responsáveis",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social', { ascending: true })

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
    }
  }

  useEffect(() => {
    fetchEmpresas()
    fetchResponsaveis()
  }, [])

  useEffect(() => {
    if (responsavelToDelete) {
      handleDeleteResponsavel()
    }
  }, [responsavelToDelete])

  const filteredResponsaveis = responsaveis.filter(
    (responsavel) =>
      responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      responsavel.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      id: "",
      empresa_id: "",
      nome: "",
      email: "",
      telefone: "",
      papel: "",
      notas: ""
    })
    setIsEditing(false)
  }

  const handleOpenDialog = (responsavel?: Responsavel) => {
    if (responsavel) {
      // Modo edição
      setFormData({
        id: responsavel.id,
        empresa_id: responsavel.empresa_id,
        nome: responsavel.nome,
        email: responsavel.email,
        telefone: responsavel.telefone || "",
        papel: responsavel.papel || "",
        notas: responsavel.notas || ""
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
      if (!formData.empresa_id) {
        throw new Error("Selecione uma empresa para o responsável")
      }

      if (isEditing) {
        // Modo edição - atualizar responsável existente
        const { error } = await supabase
          .from('responsaveis_empresas')
          .update({
            empresa_id: formData.empresa_id,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone || null,
            papel: formData.papel || null,
            notas: formData.notas || null
          })
          .eq('id', formData.id)

        if (error) throw error

        toast({
          title: "Responsável atualizado com sucesso",
          description: "As informações do responsável foram atualizadas.",
        })
      } else {
        // Modo criação - criar novo responsável
        const { error } = await supabase
          .from('responsaveis_empresas')
          .insert([
            {
              empresa_id: formData.empresa_id,
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone || null,
              papel: formData.papel || null,
              notas: formData.notas || null
            },
          ])

        if (error) throw error

        toast({
          title: "Responsável cadastrado com sucesso",
          description: "O responsável foi adicionado à empresa selecionada.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      
      // Atualizar a lista de responsáveis
      await fetchResponsaveis()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao processar responsável:', errorMessage)
      toast({
        title: isEditing ? "Erro ao atualizar responsável" : "Erro ao cadastrar responsável",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResponsavel = async () => {
    if (!responsavelToDelete) return

    try {
      const { error } = await supabase
        .from('responsaveis_empresas')
        .delete()
        .eq('id', responsavelToDelete.id)

      if (error) throw error

      toast({
        title: "Responsável excluído com sucesso",
        description: "O responsável foi removido com sucesso.",
      })

      // Atualizar a lista de responsáveis
      await fetchResponsaveis()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao excluir responsável:', errorMessage)
      toast({
        title: "Erro ao excluir responsável",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setResponsavelToDelete(null)
    }
  }

  // Função para obter o nome da empresa pelo ID
  const getEmpresaNome = (empresaId: string) => {
    const empresa = empresas.find(emp => emp.id === empresaId)
    return empresa ? empresa.razao_social : "Empresa não encontrada"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Responsáveis de Empresas</CardTitle>
          <CardDescription>Gerencie os responsáveis das empresas cadastradas.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Responsável
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Responsável" : "Cadastrar Novo Responsável"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Atualize os dados do responsável selecionado." 
                  : "Preencha os dados do responsável para cadastrá-lo no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="empresa_id">Empresa*</Label>
                  <Select
                    value={formData.empresa_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, empresa_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.razao_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome Completo*</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="papel">Cargo/Função</Label>
                  <Input
                    id="papel"
                    name="papel"
                    value={formData.papel}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notas">Observações</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows={3}
                  />
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
                    isEditing ? "Atualizar Responsável" : "Salvar Responsável"
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
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Cargo/Função</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    Carregando responsáveis...
                  </TableCell>
                </TableRow>
              ) : filteredResponsaveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum responsável encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponsaveis.map((responsavel) => (
                  <TableRow key={responsavel.id}>
                    <TableCell className="font-medium">{responsavel.nome}</TableCell>
                    <TableCell>{getEmpresaNome(responsavel.empresa_id)}</TableCell>
                    <TableCell>{responsavel.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{responsavel.telefone || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{responsavel.papel || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(responsavel)}
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
                                Tem certeza que deseja excluir o responsável {responsavel.nome}?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setResponsavelToDelete(responsavel);
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
