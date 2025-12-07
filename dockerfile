# Etapa 1: Construir a aplicação Angular
FROM node:18-alpine AS build
WORKDIR /src/app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S angular -u 1001

# Copiar arquivos de configuração
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Usar configuração do Angular sem budgets para Docker
RUN cp angular.json.docker angular.json

# Rodar o build da aplicação
RUN npm run build --configuration=production

# Verificar estrutura gerada
RUN ls -la /src/app/dist/
RUN ls -la /src/app/dist/arbitra-x/

# Mudar ownership dos arquivos
RUN chown -R angular:nodejs /src/app/dist

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copiar os arquivos do build para o diretório do Nginx
COPY --from=build /src/app/dist/arbitra-x/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
