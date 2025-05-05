#!/bin/bash

# Verificar se o repositório Git está inicializado
if [ ! -d ".git" ]; then
  echo "Inicializando repositório Git..."
  git init
fi

# Adicionar todos os arquivos
echo "Adicionando arquivos..."
git add .

# Commit das alterações
read -p "Digite a mensagem do commit: " commit_message
git commit -m "$commit_message"

# Configurar repositório remoto
read -p "Digite a URL do repositório remoto: " remote_url
git remote add origin $remote_url

# Realizar o push para o repositório remoto
echo "Realizando push para o repositório remoto..."
git push -u origin main

# Executar workflow no GitHub Actions
read -p "Confirme se deseja executar o workflow no GitHub Actions (s/n): " execute_workflow
if [ "$execute_workflow" == "s" ]; then
  echo "Executando workflow no GitHub Actions..."
  gh workflow run docker-image.yml
fi

# Verificar pré-requisitos
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
  echo "Chave SSH não encontrada. Por favor, configure uma chave SSH."
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Token do GitHub não configurado. Por favor, configure o token como uma variável de ambiente."
  exit 1
fi

# Finalização
echo "Script de deploy concluído."