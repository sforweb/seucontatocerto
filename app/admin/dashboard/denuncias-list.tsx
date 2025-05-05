"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Search, Filter, Upload, Eye, MessageSquare, Trash2, Loader2, X, Pencil } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Empresa = {
  id: string
  razao_social: string
}

type Denuncia = {
  id: string
  protocolo: string
  empresa_id: string
  titulo: string
  descricao: string
  anonima: boolean
  nome_denunciante: string | null
  email_notificacao: string | null
  estado: "pendente" | "em_analise" | "respondida"
  criada_em: string
  atualizada_em: string
  empresa?: Empresa
}

type Resposta = {
  id: string
  denuncia_id: string
  texto_resposta: string
  respondida_em: string
  admin_id: string | null
}

export function DenunciasList() {
  const supabase = createClientComponentClient()
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRespostas, setIsLoadingRespostas] = useState(false)
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null)
  const [denunciaToDelete, setDenunciaToDelete] = useState<Denuncia | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [empresaFilter, setEmpresaFilter] = useState("todas")
  const [resposta, setResposta] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [anexoFiles, setAnexoFiles] = useState<FileList | null>(null)
  const [selectedResposta, setSelectedResposta] = useState<Resposta | null>(null)
  const [respostaToDelete, setRespostaToDelete] = useState<Resposta | null>(null)
  const [editingRespostaId, setEditingRespostaId] = useState<string | null>(null)
  const [editedRespostaText, setEditedRespostaText] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const statusMap = {
    pendente: {
      label: "Pendente",
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    em_analise: {
      label: "Em Análise",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    respondida: {
      label: "Respondida",
      color: "bg-green-100 text-green-800 hover:bg-green-100",
    },
  }

  // Buscar denúncias e empresas
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Buscar empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social')

      if (empresasError) throw empresasError
      
      // Buscar denúncias com join na tabela empresas
      const { data: denunciasData, error: denunciasError } = await supabase
        .from('denuncias')
        .select(`
          *,
          empresa:empresas(id, razao_social)
        `)
        .order('criada_em', { ascending: false })

      if (denunciasError) throw denunciasError

      setEmpresas(empresasData || [])
      setDenuncias(denunciasData || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar as denúncias. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrar denúncias
  const filteredDenuncias = denuncias.filter((denuncia) => {
    const matchesSearch =
      denuncia.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (denuncia.empresa?.razao_social || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || denuncia.estado === statusFilter
    const matchesEmpresa = empresaFilter === "todas" || denuncia.empresa_id === empresaFilter

    return matchesSearch && matchesStatus && matchesEmpresa
  })

  // Função para separar respostas concatenadas em um array de respostas individuais
  const parseRespostas = (resposta: Resposta) => {
    if (!resposta.texto_resposta) return [resposta];
    
    // Verificar se o texto contém o separador de respostas
    if (!resposta.texto_resposta.includes('--- Nova resposta em')) {
      return [resposta];
    }
    
    // Separar as respostas individuais
    const partes = resposta.texto_resposta.split(/---\s*Nova resposta em\s*[\d/]+\s*---/);
    
    // Extrair as datas das respostas
    const datas = resposta.texto_resposta.match(/---\s*Nova resposta em\s*([\d/]+)\s*---/g)?.map(match => {
      const dataMatch = match.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      return dataMatch ? dataMatch[1] : null;
    }) || [];
    
    // Criar um array de respostas virtuais
    const respostas: Resposta[] = [];
    
    // Adicionar a primeira resposta (original)
    respostas.push({
      ...resposta,
      texto_resposta: partes[0].trim(),
      respondida_em: resposta.respondida_em
    });
    
    // Adicionar as respostas subsequentes
    for (let i = 1; i < partes.length; i++) {
      if (partes[i].trim()) {
        // Usar a data original para cada resposta para evitar que todas tenham a mesma hora
        let dataResposta = resposta.respondida_em;
        
        // Se temos uma data extraída, tentar usá-la
        if (datas[i-1]) {
          const dataStr = datas[i-1].match(/(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1];
          if (dataStr) {
            try {
              const [dia, mes, ano] = dataStr.split('/').map(Number);
              // Criar uma data com a hora atual para evitar que seja 00:00
              const data = new Date();
              data.setFullYear(ano);
              data.setMonth(mes - 1);
              data.setDate(dia);
              
              // Adicionar um offset de tempo para cada resposta subsequente
              // para garantir que elas apareçam em ordem cronológica
              data.setMinutes(data.getMinutes() + i);
              
              dataResposta = data.toISOString();
            } catch (e) {
              console.error('Erro ao converter data:', e);
            }
          }
        }
        
        respostas.push({
          ...resposta,
          id: `${resposta.id}-${i}`, // ID virtual para respostas separadas
          texto_resposta: partes[i].trim(),
          respondida_em: dataResposta
        });
      }
    }
    
    return respostas;
  };

  // Buscar respostas para uma denúncia
  const fetchRespostas = async (denunciaId: string) => {
    setIsLoadingRespostas(true)
    try {
      const { data, error } = await supabase
        .from('respostas')
        .select('*')
        .eq('denuncia_id', denunciaId)
        .order('respondida_em', { ascending: true })

      if (error) throw error
      
      // Processar as respostas para separar as concatenadas
      let processedRespostas: Resposta[] = [];
      if (data && data.length > 0) {
        // Importante: fazer uma cópia profunda para evitar problemas de referência
        const dataClone = JSON.parse(JSON.stringify(data));
        dataClone.forEach(resposta => {
          processedRespostas = [...processedRespostas, ...parseRespostas(resposta)];
        });
        setRespostas(processedRespostas)
      } else {
        setRespostas([])
      }
    } catch (error) {
      console.error('Erro ao buscar respostas:', error)
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível buscar as respostas desta denúncia.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingRespostas(false)
    }
  }

  // Abrir modal de visualização de denúncia
  const handleOpenViewModal = (denuncia: Denuncia) => {
    setSelectedDenuncia(denuncia)
    setIsViewModalOpen(true)
    setIsRespondModalOpen(false) // Garantir que o outro modal esteja fechado
    
    // Buscar respostas para esta denúncia
    if (denuncia.id) {
      fetchRespostas(denuncia.id)
    }
  }
  
  // Abrir modal de resposta
  const handleOpenRespondModal = (denuncia: Denuncia) => {
    setSelectedDenuncia(denuncia)
    setIsRespondModalOpen(true)
    setIsViewModalOpen(false) // Garantir que o outro modal esteja fechado
    
    // Buscar respostas para esta denúncia
    if (denuncia.id) {
      fetchRespostas(denuncia.id)
    }
  }

  // Enviar resposta
  const handleSubmitResposta = async () => {
    if (!selectedDenuncia || !resposta.trim()) return
    
    setIsSubmitting(true)

    try {
      // Obter o ID do admin atual
      const { data: { user } } = await supabase.auth.getUser()
      
      // Buscar o admin_id na tabela de admins usando o auth_uid
      let admin_id = null
      if (user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('auth_uid', user.id)
          .single()
          
        if (adminData) {
          admin_id = adminData.id
        }
      }
      
      // Inserir nova resposta
      const { error: insertError } = await supabase
        .from('respostas')
        .insert({
          denuncia_id: selectedDenuncia.id,
          texto_resposta: resposta.trim(),
          respondida_em: new Date().toISOString(),
          admin_id
        })
      
      if (insertError) {
        // Se houver erro de constraint única, pode ser porque já existe uma resposta para esta denúncia
        if (insertError.code === '23505') {
          // Buscar a resposta existente
          const { data: existingResponses } = await supabase
            .from('respostas')
            .select('*')
            .eq('denuncia_id', selectedDenuncia.id)
            .order('respondida_em', { ascending: true })
          
          if (existingResponses && existingResponses.length > 0) {
            // Formatar a data atual
            const dataAtual = new Date()
            const dataFormatada = `${dataAtual.getDate().toString().padStart(2, '0')}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getFullYear()}`
            
            // Concatenar a nova resposta à existente
            const novaResposta = `${existingResponses[0].texto_resposta}\n\n--- Nova resposta em ${dataFormatada} ---\n\n${resposta.trim()}`
            
            // Atualizar a resposta existente
            const { error: updateError } = await supabase
              .from('respostas')
              .update({
                texto_resposta: novaResposta,
                respondida_em: new Date().toISOString(),
                admin_id
              })
              .eq('id', existingResponses[0].id)
            
            if (updateError) throw updateError
          }
        } else {
          throw insertError
        }
      }
      
      // Limpar o campo de resposta e anexos
      setResposta("")
      setAnexoFiles(null)
      
      toast({
        title: "Resposta enviada com sucesso",
        description: "Sua resposta foi enviada com sucesso.",
      })
      
      // Atualizar o status da denúncia para respondida
      const { error: updateStatusError } = await supabase
        .from('denuncias')
        .update({ 
          estado: 'respondida',
          atualizada_em: new Date().toISOString()
        })
        .eq('id', selectedDenuncia.id)
      
      if (updateStatusError) {
        console.error('Erro ao atualizar status:', updateStatusError)
      }
      
      // Atualizar a lista de respostas
      await fetchRespostas(selectedDenuncia.id)
      
      // Atualizar a lista de denúncias para refletir a mudança de status
      await atualizarListaDeDenuncias();
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao tentar enviar a resposta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Iniciar edição de resposta
  const handleStartEditResposta = (respostaId: string, texto: string) => {
    setEditingRespostaId(respostaId);
    setEditedRespostaText(texto);
  }
  
  // Cancelar edição de resposta
  const handleCancelEditResposta = () => {
    setEditingRespostaId(null);
    setEditedRespostaText("");
  }
  
  // Salvar edição de resposta
  const handleSaveEditResposta = async () => {
    if (!editingRespostaId || !editedRespostaText.trim() || !selectedDenuncia) return;
    
    setIsSubmitting(true);
    
    try {
      // Obter o ID do admin atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar o admin_id na tabela de admins usando o auth_uid
      let admin_id = null;
      if (user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('auth_uid', user.id)
          .single();
          
        if (adminData) {
          admin_id = adminData.id;
        }
      }
      
      // Verificar se é uma resposta virtual (ID contém hífen e um número no final)
      if (editingRespostaId.match(/-\d+$/)) {
        // Para respostas virtuais, precisamos atualizar a resposta original
        // Buscar todas as respostas para esta denúncia
        const { data: todasRespostas } = await supabase
          .from('respostas')
          .select('*')
          .eq('denuncia_id', selectedDenuncia.id);
          
        if (!todasRespostas || todasRespostas.length === 0) {
          throw new Error('Nenhuma resposta encontrada para esta denúncia');
        }
        
        // Extrair o ID original e o índice da parte virtual
        // Formato esperado: uuid-index (ex: 123e4567-e89b-12d3-a456-426614174000-1)
        // onde o último número após o último hífen é o índice
        const lastHyphenIndex = editingRespostaId.lastIndexOf('-');
        const idOriginal = editingRespostaId.substring(0, lastHyphenIndex);
        const indice = parseInt(editingRespostaId.substring(lastHyphenIndex + 1));
        
        console.log('ID Original:', idOriginal);
        console.log('Índice Virtual:', indice);
        
        // Encontrar a resposta original no array
        const respostaOriginal = todasRespostas.find(resp => resp.id === idOriginal);
        
        if (!respostaOriginal) {
          console.error('Respostas disponíveis:', todasRespostas.map(r => r.id));
          throw new Error(`Resposta original não encontrada (ID: ${idOriginal})`);
        }
        
        // Extrair as partes da resposta
        const partes = respostaOriginal.texto_resposta.split(/---\s*Nova resposta em\s*[\d/]+\s*---/);
        const datas = respostaOriginal.texto_resposta.match(/---\s*Nova resposta em\s*([\d/]+)\s*---/g) || [];
        
        // Verificar se o índice é válido
        if (indice >= 0 && indice < partes.length) {
          // Atualizar apenas a parte específica
          partes[indice] = editedRespostaText.trim();
          
          // Reconstruir o texto completo
          let novoTexto = partes[0];
          
          for (let i = 0; i < datas.length; i++) {
            if (i + 1 < partes.length) {
              novoTexto += datas[i] + partes[i + 1];
            }
          }
          
          // Atualizar a resposta original
          const { error: updateError } = await supabase
            .from('respostas')
            .update({ 
              texto_resposta: novoTexto,
              admin_id
            })
            .eq('id', idOriginal);
          
          if (updateError) {
            throw new Error(`Erro ao atualizar resposta: ${updateError.message}`);
          }
        } else {
          throw new Error(`Índice de resposta inválido (${indice}), total de partes: ${partes.length}`);
        }
      } else {
        // É uma resposta normal, atualizar diretamente
        const { error: updateError } = await supabase
          .from('respostas')
          .update({
            texto_resposta: editedRespostaText.trim(),
            admin_id
          })
          .eq('id', editingRespostaId);
        
        if (updateError) {
          throw new Error(`Erro ao atualizar resposta: ${updateError.message}`);
        }
      }
      
      toast({
        title: "Resposta atualizada com sucesso",
        description: "A resposta foi atualizada com sucesso.",
      });
      
      // Atualizar a lista de respostas
      await fetchRespostas(selectedDenuncia.id);
      
      // Limpar o estado de edição
      setEditingRespostaId(null);
      setEditedRespostaText("");
    } catch (error) {
      console.error('Erro ao atualizar resposta:', error);
      toast({
        title: "Erro ao atualizar resposta",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Excluir resposta
  const handleDeleteResposta = (respostaId: string) => {
    // Encontrar a resposta a ser excluída
    const respostaToDelete = respostas.find(r => r.id === respostaId);
    
    if (!respostaToDelete) {
      console.error('Resposta não encontrada:', respostaId);
      return;
    }
    
    // Abrir diálogo de confirmação
    setRespostaToDelete(respostaToDelete);
    setDeleteConfirmOpen(true);
  }
  
  // Confirmar exclusão de resposta
  const confirmDeleteResposta = async () => {
    if (!respostaToDelete || !selectedDenuncia) return;
    
    setIsDeleting(true);
    
    try {
      const respostaId = respostaToDelete.id;
      console.log('Excluindo resposta com ID:', respostaId);
      
      // Verificar se é uma resposta virtual (ID contém hífen e um número no final)
      if (respostaId.includes('-')) {
        // Para respostas virtuais, precisamos atualizar a resposta original
        const idParts = respostaId.split('-');
        const idOriginal = idParts.slice(0, -1).join('-'); // Tudo menos a última parte
        const indiceVirtual = parseInt(idParts[idParts.length - 1]);
        
        console.log('ID original:', idOriginal, 'Índice virtual:', indiceVirtual);
        
        // Buscar a resposta original
        const { data: respostaOriginal, error: fetchError } = await supabase
          .from('respostas')
          .select('*')
          .eq('id', idOriginal)
          .single();
        
        if (fetchError) {
          console.error('Erro ao buscar resposta original:', fetchError);
          throw fetchError;
        }
        
        if (!respostaOriginal) {
          console.error('Resposta original não encontrada');
          throw new Error('Resposta original não encontrada');
        }
        
        // Verificar se o texto contém separadores de resposta
        if (!respostaOriginal.texto_resposta.includes('--- Nova resposta em')) {
          // Se não tem separadores, excluir a resposta inteira
          const { error: deleteError } = await supabase
            .from('respostas')
            .delete()
            .eq('id', idOriginal);
          
          if (deleteError) throw deleteError;
        } else {
          // Separar as partes da resposta
          const partes = respostaOriginal.texto_resposta.split(/---\s*Nova resposta em\s*[\d/]+\s*---/);
          const separadores = respostaOriginal.texto_resposta.match(/---\s*Nova resposta em\s*[\d/]+\s*---/g) || [];
          
          console.log('Partes encontradas:', partes.length);
          console.log('Separadores encontrados:', separadores.length);
          
          // Se só tem uma parte ou estamos excluindo a única parte restante
          if (partes.length <= 2 && indiceVirtual === 0) {
            console.log('Excluindo resposta completa porque só resta uma parte');
            const { error: deleteError } = await supabase
              .from('respostas')
              .delete()
              .eq('id', idOriginal);
            
            if (deleteError) throw deleteError;
          } else {
            // Reconstruir o texto sem a parte que queremos excluir
            let novoTexto = '';
            
            if (indiceVirtual === 0) {
              // Se estamos excluindo a primeira parte, começar da segunda
              novoTexto = partes[1];
              
              // Adicionar as partes restantes
              for (let i = 1; i < separadores.length; i++) {
                if (i + 1 < partes.length) {
                  novoTexto += separadores[i] + partes[i + 1];
                }
              }
            } else {
              // Começar com a primeira parte
              novoTexto = partes[0];
              
              // Adicionar as partes restantes, pulando a que queremos excluir
              for (let i = 0; i < separadores.length; i++) {
                if (i + 1 < partes.length && i + 1 !== indiceVirtual) {
                  novoTexto += separadores[i] + partes[i + 1];
                }
              }
            }
            
            console.log('Novo texto após exclusão:', novoTexto.substring(0, 50) + '...');
            
            // Atualizar a resposta
            const { error: updateError } = await supabase
              .from('respostas')
              .update({ texto_resposta: novoTexto.trim() })
              .eq('id', idOriginal);
            
            if (updateError) throw updateError;
          }
        }
      } else {
        // Excluir a resposta normal (não virtual)
        console.log('Excluindo resposta normal com ID:', respostaId);
        const { error: deleteError } = await supabase
          .from('respostas')
          .delete()
          .eq('id', respostaId);
        
        if (deleteError) throw deleteError;
      }
      
      // Verificar se ainda existem respostas para esta denúncia
      const { data: respostasRestantes } = await supabase
        .from('respostas')
        .select('id')
        .eq('denuncia_id', selectedDenuncia.id);
      
      // Atualizar o status da denúncia diretamente
      const novoStatus = respostasRestantes && respostasRestantes.length > 0 ? 'respondida' : 'pendente';
      
      console.log(`Atualizando status da denúncia para: ${novoStatus} (${respostasRestantes?.length || 0} respostas restantes)`);
      
      const { error: updateStatusError } = await supabase
        .from('denuncias')
        .update({
          estado: novoStatus,
          atualizada_em: new Date().toISOString()
        })
        .eq('id', selectedDenuncia.id);
      
      if (updateStatusError) {
        console.error('Erro ao atualizar status:', updateStatusError);
      }
      
      // Atualizar a interface
      await fetchRespostas(selectedDenuncia.id);
      await atualizarListaDeDenuncias();
      
      toast({
        title: "Resposta excluída com sucesso",
        description: "A resposta foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir resposta:', error);
      toast({
        title: "Erro ao excluir resposta",
        description: "Ocorreu um erro ao excluir a resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setRespostaToDelete(null);
    }
  };

  // Atualizar status da denúncia com base na existência de respostas
  const atualizarStatusDenuncia = async (denunciaId: string) => {
    try {
      // Verificar se existem respostas para esta denúncia
      const { data: respostas, error } = await supabase
        .from('respostas')
        .select('id')
        .eq('denuncia_id', denunciaId);
      
      if (error) throw error;
      
      // Determinar o novo status
      const novoStatus = respostas && respostas.length > 0 ? 'respondida' : 'pendente';
      
      console.log(`Atualizando status da denúncia ${denunciaId} para: ${novoStatus} (${respostas?.length || 0} respostas)`);
      
      // Atualizar o status da denúncia
      const { error: updateError } = await supabase
        .from('denuncias')
        .update({
          estado: novoStatus,
          atualizada_em: new Date().toISOString()
        })
        .eq('id', denunciaId);
      
      if (updateError) throw updateError;
      
      // Atualizar a lista de denúncias
      await atualizarListaDeDenuncias();
      
    } catch (error) {
      console.error('Erro ao atualizar status da denúncia:', error);
    }
  };

  // Marcar como "Em Análise"
  const handleMarcarEmAnalise = async (denuncia: Denuncia) => {
    try {
      const { error } = await supabase
        .from('denuncias')
        .update({
          estado: 'em_analise',
          atualizada_em: new Date().toISOString()
        })
        .eq('id', denuncia.id)

      if (error) throw error

      toast({
        title: "Status atualizado",
        description: "Denúncia marcada como 'Em Análise'.",
      })

      await atualizarListaDeDenuncias()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da denúncia.",
        variant: "destructive",
      })
    }
  }

  // Atualizar lista de denúncias
  const atualizarListaDeDenuncias = async () => {
    setIsLoading(true)
    try {
      // Buscar empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social')

      if (empresasError) throw empresasError
      
      // Buscar denúncias com join na tabela empresas
      const { data: denunciasData, error: denunciasError } = await supabase
        .from('denuncias')
        .select(`
          *,
          empresa:empresas(id, razao_social)
        `)
        .order('criada_em', { ascending: false })

      if (denunciasError) throw denunciasError

      setEmpresas(empresasData || [])
      setDenuncias(denunciasData || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar as denúncias. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Excluir denúncia
  const handleDeleteConfirm = async () => {
    if (!denunciaToDelete) return

    try {
      // Excluir respostas relacionadas
      const { error: respostasError } = await supabase
        .from('respostas')
        .delete()
        .eq('denuncia_id', denunciaToDelete.id)

      if (respostasError) throw respostasError

      // Excluir anexos relacionados
      const { error: anexosError } = await supabase
        .from('anexos')
        .delete()
        .or(`tipo_pai.eq.denuncia,pai_id.eq.${denunciaToDelete.id}`)

      if (anexosError) throw anexosError

      // Excluir a denúncia
      const { error: denunciaError } = await supabase
        .from('denuncias')
        .delete()
        .eq('id', denunciaToDelete.id)

      if (denunciaError) throw denunciaError

      toast({
        title: "Denúncia excluída",
        description: "A denúncia foi removida permanentemente.",
      })

      await atualizarListaDeDenuncias()
    } catch (error) {
      console.error('Erro ao excluir denúncia:', error)
      toast({
        title: "Erro ao excluir denúncia",
        description: "Ocorreu um erro ao tentar excluir a denúncia.",
        variant: "destructive",
      })
    } finally {
      setDenunciaToDelete(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAnexoFiles(e.target.files)
    }
  }

  // Formatar datas de forma segura para SSR
  const formatDate = (dateString: string) => {
    try {
      return (
        <span suppressHydrationWarning>
          {format(new Date(dateString), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
        </span>
      )
    } catch (error) {
      return "Data inválida"
    }
  }

  // Gerar nomes de arquivos sem Math.random() para evitar problemas de hidratação
  const generateUniqueFileName = (originalName: string) => {
    // Usar timestamp e hash baseado no nome original em vez de Math.random()
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
    
    // Criar um hash simples baseado no nome do arquivo
    let hash = 0;
    for (let i = 0; i <nameWithoutExtension.length; i++) {
      hash = ((hash << 5) - hash) + nameWithoutExtension.charCodeAt(i);
      hash |= 0; // Converter para inteiro de 32 bits
    }
    
    return `${nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}_${Math.abs(hash)}.${extension}`;
  };

  // Remover arquivo da lista de anexos
  const handleRemoveFile = (index: number) => {
    if (!anexoFiles) return
    
    const dt = new DataTransfer()
    const files = Array.from(anexoFiles)
    
    files.forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    
    setAnexoFiles(dt.files.length > 0 ? dt.files : null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Denúncias</CardTitle>
        <CardDescription>Gerencie e responda às denúncias recebidas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="flex w-full items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por protocolo, título ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="respondida">Respondida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as empresas</SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="hidden md:table-cell">Título</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDenuncias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma denúncia encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDenuncias.map((denuncia) => (
                  <TableRow key={denuncia.id}>
                    <TableCell className="font-mono font-medium">{denuncia.protocolo}</TableCell>
                    <TableCell>{denuncia.empresa?.razao_social}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate md:table-cell">{denuncia.titulo}</TableCell>
                    <TableCell className="hidden md:table-cell" suppressHydrationWarning>{formatDate(denuncia.criada_em)}</TableCell>
                    <TableCell>
                      <Badge className={statusMap[denuncia.estado].color} variant="outline">
                        {statusMap[denuncia.estado].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenViewModal(denuncia)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenRespondModal(denuncia)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Responder denúncia
                          </DropdownMenuItem>
                          {denuncia.estado === 'pendente' && (
                            <DropdownMenuItem onClick={() => handleMarcarEmAnalise(denuncia)}>
                              <Filter className="mr-2 h-4 w-4" />
                              Marcar como em análise
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDenunciaToDelete(denuncia)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir denúncia
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de visualização de denúncia */}
        <Dialog open={isViewModalOpen} onOpenChange={(open) => {
          setIsViewModalOpen(open);
          // Atualizar a lista de denúncias quando o modal é fechado
          if (!open && selectedDenuncia) {
            atualizarListaDeDenuncias();
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="px-6">
              <DialogTitle>Detalhes da Denúncia</DialogTitle>
              <DialogDescription>
                Visualização completa da denúncia e suas respostas.
              </DialogDescription>
            </DialogHeader>
            
            {selectedDenuncia && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1 px-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                  {/* Detalhes da denúncia */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Protocolo</Label>
                        <div className="font-mono text-sm">{selectedDenuncia.protocolo}</div>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div>
                          <Badge className={statusMap[selectedDenuncia.estado].color} variant="outline">
                            {statusMap[selectedDenuncia.estado].label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label>Empresa</Label>
                        <div className="text-sm">{selectedDenuncia.empresa?.razao_social}</div>
                      </div>
                      <div>
                        <Label>Data</Label>
                        <div className="text-sm" suppressHydrationWarning>
                          {formatDate(selectedDenuncia.criada_em)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Título</Label>
                      <div className="text-sm font-medium">{selectedDenuncia.titulo}</div>
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                      <div className="text-sm">{selectedDenuncia.descricao}</div>
                    </div>
                    
                    {selectedDenuncia.anexos && selectedDenuncia.anexos.length > 0 && (
                      <div>
                        <Label>Anexos</Label>
                        <ul className="text-sm space-y-1 mt-1">
                          {selectedDenuncia.anexos.map((anexo, index) => (
                            <li key={index}>
                              <a
                                href={anexo.url_arquivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {anexo.nome_arquivo}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Respostas anteriores */}
                  {respostas.length > 0 && (
                    <div className="grid gap-2 mb-6">
                      <Label>Respostas</Label>
                      <div className="space-y-3">
                        {respostas.map((resposta) => (
                          <div key={resposta.id} className="rounded-md border p-3 text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{resposta.admin?.nome?.charAt(0) || 'A'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-xs">{resposta.admin?.nome || 'Administrador'}</div>
                                  <div suppressHydrationWarning className="text-xs text-gray-500">
                                    {formatDate(resposta.respondida_em)}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Sem botões de edição na visualização */}
                            </div>
                            
                            <div className="whitespace-pre-wrap">{resposta.texto_resposta}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="px-6">
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de resposta */}
        <Dialog open={isRespondModalOpen} onOpenChange={(open) => {
          setIsRespondModalOpen(open);
          // Atualizar a lista de denúncias quando o modal é fechado
          if (!open && selectedDenuncia) {
            atualizarListaDeDenuncias();
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="px-6">
              <DialogTitle>Responder Denúncia</DialogTitle>
              <DialogDescription>
                Adicione uma resposta à denúncia selecionada.
              </DialogDescription>
            </DialogHeader>
            
            {selectedDenuncia && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1 px-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                  {/* Detalhes da denúncia */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Protocolo</Label>
                        <div className="font-mono text-sm">{selectedDenuncia.protocolo}</div>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div>
                          <Badge className={statusMap[selectedDenuncia.estado].color} variant="outline">
                            {statusMap[selectedDenuncia.estado].label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label>Empresa</Label>
                        <div className="text-sm">{selectedDenuncia.empresa?.razao_social}</div>
                      </div>
                      <div>
                        <Label>Data</Label>
                        <div className="text-sm" suppressHydrationWarning>
                          {formatDate(selectedDenuncia.criada_em)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Título</Label>
                      <div className="text-sm font-medium">{selectedDenuncia.titulo}</div>
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                      <div className="text-sm">{selectedDenuncia.descricao}</div>
                    </div>
                    
                    {selectedDenuncia.anexos && selectedDenuncia.anexos.length > 0 && (
                      <div>
                        <Label>Anexos</Label>
                        <ul className="text-sm space-y-1 mt-1">
                          {selectedDenuncia.anexos.map((anexo, index) => (
                            <li key={index}>
                              <a
                                href={anexo.url_arquivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {anexo.nome_arquivo}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Respostas anteriores */}
                  {respostas.length > 0 && (
                    <div className="grid gap-2 mb-6">
                      <Label>Respostas</Label>
                      <div className="space-y-3">
                        {respostas.map((resposta) => (
                          <div key={resposta.id} className="rounded-md border p-3 text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{resposta.admin?.nome?.charAt(0) || 'A'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-xs">{resposta.admin?.nome || 'Administrador'}</div>
                                  <div suppressHydrationWarning className="text-xs text-gray-500">
                                    {formatDate(resposta.respondida_em)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-1">
                                {editingRespostaId === resposta.id ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCancelEditResposta()}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveEditResposta()}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Salvando
                                        </>
                                      ) : (
                                        'Salvar'
                                      )}
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleStartEditResposta(resposta.id, resposta.texto_resposta)}
                                    >
                                      <Pencil className="h-4 w-4 text-blue-600" />
                                      <span className="sr-only">Editar</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDeleteResposta(resposta.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                      <span className="sr-only">Excluir</span>
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {editingRespostaId === resposta.id ? (
                              <Textarea
                                value={editedRespostaText}
                                onChange={(e) => setEditedRespostaText(e.target.value)}
                                className="w-full mt-2"
                                rows={4}
                              />
                            ) : (
                              <div className="whitespace-pre-wrap">{resposta.texto_resposta}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Formulário de resposta */}
                  <div className="grid gap-2">
                    <Label htmlFor="resposta">Nova Resposta</Label>
                    <Textarea
                      id="resposta"
                      placeholder="Digite sua resposta para o denunciante..."
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      rows={4}
                    />
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Label htmlFor="anexo" className="cursor-pointer text-sm text-blue-600 hover:underline">
                        Anexar arquivo
                      </Label>
                      <Input
                        id="anexo"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                      />
                      {anexoFiles && anexoFiles.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {anexoFiles.length} {anexoFiles.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
                        </div>
                      )}
                    </div>
                    
                    {anexoFiles && anexoFiles.length > 0 && (
                      <div className="grid gap-1 mt-1">
                        {Array.from(anexoFiles).map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-1 rounded">
                            <span className="truncate max-w-[300px]">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="px-6">
                  <Button variant="outline" onClick={() => setIsRespondModalOpen(false)}>
                    Fechar
                  </Button>
                  <Button 
                    onClick={handleSubmitResposta} 
                    disabled={!resposta.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando
                      </>
                    ) : (
                      'Enviar Resposta'
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmação de exclusão */}
        <AlertDialog open={!!denunciaToDelete} onOpenChange={(open) => !open && setDenunciaToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta denúncia? Esta ação não pode ser desfeita e todos os dados relacionados serão removidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de confirmação para excluir resposta */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir resposta</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRespostaToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteResposta}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
