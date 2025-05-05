# Configuração do Canal de Denúncias no Portainer

Este documento contém instruções detalhadas para configurar e implantar o Canal de Denúncias utilizando o Portainer e o arquivo `portainer-deployment.yml`.

## Pré-requisitos

- Docker e Portainer instalados no servidor
- Acesso à interface web do Portainer
- Variáveis de ambiente do Supabase configuradas

## Passo a Passo para Implantação

### 1. Acessar o Portainer

1. Abra seu navegador e acesse a URL do Portainer (geralmente `http://seu-servidor:9000` ou `http://seu-servidor:9443`)
2. Faça login com suas credenciais de administrador

### 2. Criar uma Nova Stack

1. No menu lateral, clique em **Stacks**
2. Clique no botão **+ Add stack**
3. Dê um nome para a stack (ex: `canal-denuncias`)

### 3. Configurar a Stack

1. Na seção **Build method**, selecione **Web editor**
2. Copie todo o conteúdo do arquivo `portainer-deployment.yml` e cole no editor de texto

```yaml
version: '3.8'

services:
  # Frontend Next.js - Canal de Denúncias
  canal_denuncias:
    image: node:20-alpine
    container_name: canal_denuncias
    restart: always
    ports:
      - "3001:3000" # Porta 3001 externa para evitar conflitos com outros serviços
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=https://udvchlncluoznnjmafru.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdmNobG5jbHVvem5uam1hZnJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUwNTQyNiwiZXhwIjoyMDYxMDgxNDI2fQ.zFzcClD4p5dVQojgzRQKRYJhArWgl2IHCMIHTTRXic4
    volumes:
      - canal_denuncias_app:/app # Volume para os arquivos da aplicação
    command: >
      sh -c "echo 'Container do Canal de Denúncias iniciado. Aguardando upload dos arquivos da aplicação via script.'
             tail -f /dev/null" # Mantém o container rodando aguardando os arquivos
    networks:
      - canal_denuncias_network
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 1024M
      labels:
        - traefik.enable=true
        - traefik.http.routers.canal_denuncias.rule=Host(`canal-denuncias.automatiza.pt`)
        - traefik.http.routers.canal_denuncias.entrypoints=websecure
        - traefik.http.routers.canal_denuncias.priority=1
        - traefik.http.routers.canal_denuncias.tls.certresolver=letsencryptresolver
        - traefik.http.routers.canal_denuncias.service=canal_denuncias
        - traefik.http.services.canal_denuncias.loadbalancer.server.port=3000
        - traefik.http.services.canal_denuncias.loadbalancer.passHostHeader=1

volumes:
  canal_denuncias_app:
    name: canal_denuncias_app

networks:
  canal_denuncias_network:
    name: canal_denuncias_network
    driver: bridge
```

### 4. Configurar Variáveis de Ambiente

1. Na seção **Environment variables**, adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`: https://udvchlncluoznnjmafru.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdmNobG5jbHVvem5uam1hZnJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUwNTQyNiwiZXhwIjoyMDYxMDgxNDI2fQ.zFzcClD4p5dVQojgzRQKRYJhArWgl2IHCMIHTTRXic4

### 5. Implantar a Stack

1. Clique no botão **Deploy the stack**
2. Aguarde a criação do container

### 6. Verificar o Status

1. Após a implantação, verifique se o container está em execução na lista de containers
2. O container estará aguardando o upload dos arquivos da aplicação

## Deploy da Aplicação

Após a criação do container via Portainer, é necessário fazer o deploy dos arquivos da aplicação utilizando o script `deploy.sh`.

### Preparar e Transferir a Aplicação

1.  **Prepare a Aplicação Localmente:**
    No seu ambiente de desenvolvimento, certifique-se de que todas as dependências estão instaladas e a aplicação está pronta para build:
    ```bash
    npm install
    npm run build
    ```
    *Nota: O build final será feito dentro do container, mas é bom garantir que tudo está funcionando localmente.*

2.  **Crie a Pasta no Servidor:**
    Conecte-se ao seu servidor via SSH e crie a pasta que será mapeada para o container (se ainda não existir):
    ```bash
    ssh seu-usuario@seu-servidor.com
    sudo mkdir -p /data/canal_denuncias_app
    sudo chown -R seu-usuario:seu-grupo /data/canal_denuncias_app # Ajuste o usuário/grupo se necessário
    exit
    ```

3.  **Transfira os Arquivos:**
    Use um cliente SFTP (como FileZilla, Cyberduck ou o comando `scp`) para copiar **todo o conteúdo** da pasta do seu projeto local (exceto `node_modules` e `.git`) para a pasta `/data/canal_denuncias_app` no servidor.

    Exemplo usando `scp` (execute do seu terminal local):
    ```bash
    # Certifique-se de estar na pasta raiz do projeto
    scp -r ./* seu-usuario@seu-servidor.com:/data/canal_denuncias_app/
    # Você pode precisar remover node_modules antes ou usar rsync com exclusão
    ```

### Executar Comandos no Container via Portainer

1.  **Acesse o Console do Container:**
    - Vá até a seção "Containers" no Portainer.
    - Encontre o container `canal_denuncias`.
    - Clique no ícone "Console" (geralmente `</>`).
    - Conecte-se como o usuário padrão (geralmente `root` ou `node`).

2.  **Instale Dependências e Inicie a Aplicação:**
    Dentro do console do container, navegue até o diretório da aplicação e execute os comandos necessários:
    ```bash
    cd /app
    npm ci --production # Instala apenas dependências de produção
    npm run build # Se o build for necessário no servidor
    node server.js # Ou o comando para iniciar sua aplicação
    ```
    *Nota: O comando `node server.js` pode variar dependendo de como sua aplicação é iniciada. Verifique seu `package.json`.*

### Acessar a Aplicação

Após a conclusão do deploy, a aplicação estará disponível em:

```
http://seu-servidor:3001
```

## Solução de Problemas

### Container não encontrado

Se o script de deploy reportar que o container não foi encontrado, verifique:

1. Se a stack foi implantada corretamente no Portainer
2. Se o nome do container no script (`CONTAINER_NAME="canal_denuncias"`) corresponde ao nome definido no arquivo `portainer-deployment.yml`

### Falha no Build

Se ocorrer falha durante o build da aplicação:

1. Verifique os logs do container para identificar o erro específico
2. Certifique-se de que todas as dependências estão corretamente definidas no `package.json`

## Manutenção

### Atualizar a Aplicação

Para atualizar a aplicação após alterações no código, execute novamente o script `deploy.sh`.

### Reiniciar o Container

Se necessário reiniciar o container, você pode fazê-lo através da interface do Portainer:

1. Acesse a seção **Containers**
2. Localize o container `canal_denuncias`
3. Clique no botão de reiniciar (ícone de seta circular)

---

Este documento foi criado para auxiliar na implantação do Canal de Denúncias utilizando Portainer. Para mais informações, consulte a documentação do Docker e do Portainer.