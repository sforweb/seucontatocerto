"use client"

import { useEffect, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search, Users, Pencil, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Usuario = {
  id: string
  auth_uid: string | null
  nome: string
  email: string
  telefone: string | null
  tipo_admin: string
  criado_em: string
}

export function UsuariosList() {
  const supabase = createClientComponentClient()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserType, setCurrentUserType] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    auth_uid: "",
    nome: "",
    email: "",
    telefone: "",
    tipo_admin: "admin",
    senha: "",
    confirmarSenha: "",
    alterarSenha: false,
  })

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, auth_uid, nome, email, telefone, tipo_admin, criado_em')
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('Erro do Supabase:', error.message, error.details, error.hint)
        throw new Error(`Erro ao carregar usuários: ${error.message}`)
      }

      if (!data) {
        console.warn('Nenhum dado retornado do Supabase')
        setUsuarios([])
        return
      }

      setUsuarios(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao carregar usuários:', errorMessage)
      toast({
        title: "Erro ao carregar usuários",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast({
            title: "Erro de autenticação",
            description: "Usuário não autenticado",
            variant: "destructive",
          })
          return
        }

        setCurrentUserId(user.id)

        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('tipo_admin')
          .eq('auth_uid', user.id)
          .single()

        if (adminError) {
          throw adminError
        }

        if (!adminData) {
          toast({
            title: "Erro de permissão",
            description: "Usuário não possui permissões de administrador",
            variant: "destructive",
          })
          return
        }

        setCurrentUserType(adminData.tipo_admin)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        console.error('Erro ao obter usuário atual:', errorMessage)
        toast({
          title: "Erro ao verificar permissões",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }

    getCurrentUser()
    fetchUsuarios()
  }, [])

  useEffect(() => {
    if (usuarioToDelete) {
      handleDeleteUser();
    }
  }, [usuarioToDelete]);

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validação de senha em tempo real
    if (name === 'senha' && value.length < 6 && !isEditing) {
      e.target.setCustomValidity('A senha deve ter pelo menos 6 caracteres.')
    } else if (name === 'confirmarSenha' && value !== formData.senha && !isEditing) {
      e.target.setCustomValidity('As senhas não coincidem.')
    } else {
      e.target.setCustomValidity('')
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      auth_uid: "",
      nome: "",
      email: "",
      telefone: "",
      tipo_admin: "admin",
      senha: "",
      confirmarSenha: "",
      alterarSenha: false,
    })
    setIsEditing(false)
  }

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      // Modo edição
      setFormData({
        id: usuario.id,
        auth_uid: usuario.auth_uid || "",
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || "",
        tipo_admin: usuario.tipo_admin,
        senha: "",
        confirmarSenha: "",
        alterarSenha: false,
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
    
    // Verificação de senha apenas para novos usuários ou alteração de senha
    if ((formData.alterarSenha || !isEditing) && formData.senha !== formData.confirmarSenha) {
      toast({
        title: "Erro ao processar usuário",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    // Verificar permissões para criar usuário Master
    if (currentUserType !== 'master' && formData.tipo_admin === 'master') {
      toast({
        title: "Erro de permissão",
        description: "Apenas usuários Master podem cadastrar outros usuários Master.",
        variant: "destructive",
      })
      return
    }

    // Verificar permissões para alterar senha
    if (formData.alterarSenha && isEditing) {
      const usuarioAlvo = usuarios.find(u => u.id === formData.id)
      
      if (!usuarioAlvo) {
        toast({
          title: "Erro ao processar usuário",
          description: "Usuário não encontrado.",
          variant: "destructive",
        })
        return
      }

      // Verificar se Admin está tentando alterar senha de um Master
      if (currentUserType !== 'master' && usuarioAlvo.tipo_admin === 'master') {
        toast({
          title: "Erro de permissão",
          description: "Apenas usuários Master podem alterar a senha de outros usuários Master.",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (isEditing) {
        // Modo edição - atualizar usuário existente
        const updateData: any = {
          nome: formData.nome,
          telefone: formData.telefone,
          tipo_admin: formData.tipo_admin,
        }

        // Atualizar dados na tabela admins
        const { error: adminError } = await supabase
          .from('admins')
          .update(updateData)
          .eq('id', formData.id)

        if (adminError) throw adminError

        // Se solicitou alteração de senha e tem auth_uid
        if (formData.alterarSenha && formData.auth_uid) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            formData.auth_uid,
            { password: formData.senha }
          )

          if (passwordError) {
            throw new Error(`Erro ao atualizar senha: ${passwordError.message}`)
          }
        }

        toast({
          title: "Usuário atualizado com sucesso",
          description: formData.alterarSenha 
            ? "As informações e senha do usuário foram atualizadas."
            : "As informações do usuário foram atualizadas.",
        })
      } else {
        // Modo criação - criar novo usuário
        // 1. Criar usuário no Auth do Supabase
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.senha,
          email_confirm: true
        })

        if (authError) throw authError

        if (!authData.user) {
          throw new Error("Falha ao criar usuário na autenticação")
        }

        // 2. Inserir dados na tabela admins
        const { error: adminError } = await supabase
          .from('admins')
          .insert([
            {
              auth_uid: authData.user.id,
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
              tipo_admin: formData.tipo_admin,
              senha_hash: formData.senha // Apenas para referência, não usado para autenticação
            },
          ])

        if (adminError) {
          // Se falhar ao inserir na tabela admins, tentar remover o usuário do Auth
          await supabase.auth.admin.deleteUser(authData.user.id)
          throw adminError
        }

        toast({
          title: "Usuário cadastrado com sucesso",
          description: "O usuário foi adicionado à lista de administradores.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      
      // Atualizar a lista de usuários
      await fetchUsuarios()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao processar usuário:', errorMessage)
      toast({
        title: isEditing ? "Erro ao atualizar usuário" : "Erro ao cadastrar usuário",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!usuarioToDelete) return

    // Verificar se é um usuário Master (não pode ser excluído)
    if (usuarioToDelete.tipo_admin === 'master') {
      toast({
        title: "Operação não permitida",
        description: "Usuários Master não podem ser excluídos pelo sistema.",
        variant: "destructive",
      })
      setUsuarioToDelete(null)
      return
    }

    // Verificar permissões (apenas Master ou o próprio usuário Admin pode excluir outros Admins)
    if (currentUserType !== 'master' && usuarioToDelete.auth_uid !== currentUserId) {
      toast({
        title: "Erro de permissão",
        description: "Você não tem permissão para excluir este usuário.",
        variant: "destructive",
      })
      setUsuarioToDelete(null)
      return
    }

    try {
      // 1. Excluir da tabela admins
      const { error: adminError } = await supabase
        .from('admins')
        .delete()
        .eq('id', usuarioToDelete.id)

      if (adminError) throw adminError

      // 2. Excluir do Auth se tiver auth_uid
      if (usuarioToDelete.auth_uid) {
        const { error: authError } = await supabase.auth.admin.deleteUser(
          usuarioToDelete.auth_uid
        )

        if (authError) {
          console.error('Erro ao excluir usuário do Auth:', authError)
          // Continuar mesmo se falhar no Auth, pois já foi removido da tabela admins
        }
      }

      toast({
        title: "Usuário excluído com sucesso",
        description: "O usuário foi removido da lista de administradores.",
      })

      // Atualizar a lista de usuários
      await fetchUsuarios()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro ao excluir usuário:', errorMessage)
      toast({
        title: "Erro ao excluir usuário",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUsuarioToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>Gerencie os usuários administradores do sistema.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Usuário" : "Cadastrar Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Atualize os dados do usuário selecionado." 
                  : "Preencha os dados do usuário para cadastrá-lo no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
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
                    disabled={isEditing}
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
                  <Label htmlFor="tipo_admin">Tipo de Usuário*</Label>
                  <Select
                    value={formData.tipo_admin}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_admin: value }))}
                    disabled={currentUserType !== 'master' && formData.tipo_admin === 'master'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      {currentUserType === 'master' && (
                        <SelectItem value="master">Master</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {!isEditing && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="senha">Senha*</Label>
                      <Input
                        id="senha"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleInputChange}
                        required={!isEditing}
                        minLength={6}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmarSenha">Confirmar Senha*</Label>
                      <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        required={!isEditing}
                      />
                    </div>
                  </>
                )}
                {isEditing && (
                  <div className="space-y-4 border-t pt-4 mt-2">
                    <div className="flex items-center space-x-2 py-2">
                      <Checkbox 
                        id="alterarSenha" 
                        checked={formData.alterarSenha}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, alterarSenha: checked === true }))
                        }
                        disabled={currentUserType !== 'master' && formData.tipo_admin === 'master'}
                      />
                      <Label 
                        htmlFor="alterarSenha" 
                        className={cn(
                          "text-sm font-medium leading-none cursor-pointer",
                          (currentUserType !== 'master' && formData.tipo_admin === 'master') && "text-muted-foreground"
                        )}
                      >
                        {currentUserType !== 'master' && formData.tipo_admin === 'master' 
                          ? "Apenas usuários Master podem alterar senhas de outros Master" 
                          : "Alterar senha do usuário"}
                      </Label>
                    </div>
                    
                    {formData.alterarSenha && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="senha">Nova Senha*</Label>
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleInputChange}
                            required={formData.alterarSenha}
                            minLength={6}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirmarSenha">Confirmar Nova Senha*</Label>
                          <Input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            value={formData.confirmarSenha}
                            onChange={handleInputChange}
                            required={formData.alterarSenha}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
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
                    isEditing ? "Atualizar Usuário" : "Salvar Usuário"
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
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Data Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{usuario.telefone}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          usuario.tipo_admin === "master"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {usuario.tipo_admin === "master" ? "Master" : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(usuario.criado_em).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(usuario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              disabled={usuario.tipo_admin === 'master'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário {usuario.nome}?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setUsuarioToDelete(usuario);
                                  // Não chamar handleDeleteUser() aqui, pois setUsuarioToDelete é assíncrono
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