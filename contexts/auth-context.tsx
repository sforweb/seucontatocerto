'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Primeiro, autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Classificar erros de autenticação
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Credenciais inválidas')
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado')
        } else if (authError.message.includes('rate limit')) {
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde')
        } else {
          throw new Error(`Erro de autenticação: ${authError.message}`)
        }
      }

      // Verificar se o usuário existe na tabela de admins
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      if (adminError) {
        if (adminError.code === 'PGRST116') {
          // Código para 'não encontrado'
          await supabase.auth.signOut()
          throw new Error('Usuário não autorizado como administrador')
        } else {
          await supabase.auth.signOut()
          throw new Error(`Erro ao verificar permissões: ${adminError.message}`)
        }
      }

      if (!adminData) {
        await supabase.auth.signOut()
        throw new Error('Usuário não autorizado como administrador')
      }

      // Atualizar o auth_uid se necessário
      if (!adminData.auth_uid) {
        const { error: updateError } = await supabase
          .from('admins')
          .update({ auth_uid: authData.user?.id })
          .eq('id', adminData.id)

        if (updateError) {
          throw new Error(`Erro ao atualizar perfil: ${updateError.message}`)
        }
      }

      router.push('/admin/dashboard')
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/admin/login')
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}