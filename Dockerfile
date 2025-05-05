# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar código fonte
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas os arquivos necessários do estágio de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Definir permissões corretas
RUN chown -R nextjs:nodejs /app

# Mudar para o usuário não-root
USER nextjs

# Expor a porta que a aplicação usa
EXPOSE 3000

# Definir variáveis de ambiente para o Next.js
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Comando para iniciar a aplicação
CMD ["node", "server.js"]