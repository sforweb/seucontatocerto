
-- 1. Enum para status da denúncia
CREATE TYPE estado_denuncia AS ENUM (
  'pendente',
  'em_analise',
  'respondida'
);

-- 2. Tabela de empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social TEXT NOT NULL,
  cnpj CHAR(14) NOT NULL UNIQUE,
  inscricao_estadual TEXT,
  endereco TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado CHAR(2) NOT NULL,
  cep CHAR(8) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_empresas_cnpj ON empresas (cnpj);
CREATE INDEX idx_empresas_cidade ON empresas (cidade);

-- 3. Responsáveis da empresa
CREATE TABLE responsaveis_empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  papel TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Denúncias
CREATE TABLE denuncias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo VARCHAR(20) NOT NULL UNIQUE,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
  anonima BOOLEAN NOT NULL DEFAULT FALSE,
  nome_denunciante TEXT,
  email_notificacao TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  estado estado_denuncia NOT NULL DEFAULT 'pendente',
  criada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizada_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_denuncias_empresa ON denuncias (empresa_id);
CREATE INDEX idx_denuncias_estado ON denuncias (estado);
CREATE INDEX idx_denuncias_data ON denuncias (criada_em);

-- 5. Respostas das empresas
CREATE TABLE respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  denuncia_id UUID NOT NULL UNIQUE REFERENCES denuncias(id) ON DELETE CASCADE,
  texto_resposta TEXT NOT NULL,
  respondida_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  admin_id UUID REFERENCES admins(id)
);

-- 6. Anexos
CREATE TABLE anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_pai TEXT NOT NULL CHECK (tipo_pai IN ('denuncia','resposta')),
  pai_id UUID NOT NULL,
  url_arquivo TEXT NOT NULL,
  nome_arquivo TEXT,
  mime_type TEXT,
  enviado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_anexos_pai ON anexos (tipo_pai, pai_id);

-- 7. Administradores
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  senha_hash TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Logs de auditoria
CREATE TABLE logs_auditoria (
  id BIGSERIAL PRIMARY KEY,
  entidade TEXT NOT NULL,
  entidade_id UUID NOT NULL,
  acao TEXT NOT NULL,
  realizado_por UUID REFERENCES admins(id),
  detalhes JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_logs_entidade ON logs_auditoria (entidade, entidade_id);