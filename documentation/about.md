
## 1. Contexto & Objetivo

Crie uma aplicação web completa que atenda à nova lei brasileira de canal neutro de denúncias, permitindo que colaboradores registrem reclamações (anônimas ou identificadas) contra a empresa em que trabalham, e acompanhem o feedback dado por essa empresa.

## 2. Principais Páginas & Fluxos

1. **Home Page**
    
    - Mensagem clara de valor (“Canal seguro e independente para voz do colaborador”)
    - Destaque de benefícios: anonimato opcional, facilidade de uso, transparência
    - CTA principal aprimorado: “Registre aqui a sua insatisfação”
    - Link visível para “Cadastrar Reclamação”
2. **Página de Cadastro de Denúncia/Reclamação**
    
    - Campo texto: “Nome da empresa ou CNPJ” com autocomplete/busca
    - Validação: só empresas previamente cadastradas (ver Dashboard Admin)
    - Opção de “Enviar anonimamente” (checkbox)
    - Formulário de relato: título, descrição, anexos (opcional)
    - Ao enviar, gerar **número de protocolo** único + mostrar “Data/Hora de envio”
    - E-mail opcional para notificações (sem vínculo ao protocolo)
3. **Tela de Consulta de Protocolo (público)**
    
    - Campo de busca por protocolo
    - Exibir: data/hora de registro, status (pendente, em análise, respondido), texto da resposta da empresa (quando disponível), data/hora de feedback
4. **Login Administrador**
    
    - Autenticação segura (e‑mail + senha)
    - “Esqueci minha senha”
5. **Dashboard Admin**
    
    - **Visão Geral (cards de KPI)**
        - Total de denúncias recebidas
        - Percentual de respostas dadas
        - Tempo médio de resposta (hh:mm)
        - Denúncias pendentes
    - **Gráficos** (inspiração no anexo “dashboard MediNexus”):
        - Série temporal de denúncias/mês
        - Heatmap de horários de envio (opcional)
    - **Gerenciamento de Empresas**
        - Formulário de cadastro: Razão Social, CNPJ, Inscrição estadual, Endereço completo, contato de compliance
        - Lista de empresas cadastradas (busca/filtra)
    - **Lista de Denúncias**
        - Tabela paginada com filtros por empresa, status, data
        - Acesso rápido para inserir “Feedback da Empresa” (texto + anexos)
        - Ao submeter feedback, registrar “Data/Hora de resposta” e notificar o reclamante

## 3. Requisitos Funcionais

- **Anonimato**: opção de não vincular nome ou e‑mail
- **Protocolo único**: para rastreamento público via número (sem login)
- **Notificações**: e‑mail para reclamante e e‑mail interno para admins
- **Segurança**: SSL/TLS, proteção contra CSRF, validação de entrada
- **Auditoria de tempo**: armazenar timestamps de envio e retorno
- **Internacionalização futura**: base em Portuguese (pt-BR)

## 4. Diretrizes de Design & UX

- **Paleta de Cores** (use exatamente):
    - Primária: `#105CC6`
    - Acento: `#46B2FF`
    - Fundo claro: `#E7EFF9`, `#D2DDEC`, `#FFFFFF`
    - Texto escuro: `#1E1E1E`
- **Tipografia**: Urbanist (Regular, Medium, Semi‑bold)
- **Estilo**:
    - Layout clean, muito espaço em branco, cards com cantos arredondados (8px) e sombra suave
    - Botões com transições suaves ao hover
    - Forms com campos claros, labels acima, foco destacado em `#46B2FF`
- **Inspiração Visual**:
    - Referência de dashboard “MediNexus” anexada (cards, gráficos, chat widget)
    - Experiência fluida em desktop e mobile (responsivo)

## 5. Stack Sugerido (opcional)

- **Front‑end**: React (Next.js) + Tailwind CSS ou Chakra UI
- **Back‑end**: Node.js (Express) ou Python (FastAPI)
- **Banco de Dados**: PostgreSQL ou MongoDB
- **Autenticação**: JWT + refresh tokens
- **Deployment**: Vercel (front) + Heroku/DigitalOcean (API + DB)

## 6. Entregáveis Esperados

- Repositório Git com código front‑end e back‑end separados
- Documentação de setup e endpoints (Swagger ou similar)
- Scripts de migração/criação de esquema de BD (iremos usar o Supabase)
- Pró‑totipo funcional com as telas descritas
- Testes automatizados básicos (unitários e integração)

> **Observação**: todos os elementos visuais devem seguir fielmente o branding (cores, fonte, espaçamentos) e transmitir **segurança**, **transparência** e **profissionalismo**. Seguem em anexo referencia da paleta de cores e sua aplicação em um Dashboard para referência.