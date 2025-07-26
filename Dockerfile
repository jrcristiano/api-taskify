FROM node:lts-alpine

WORKDIR /app

# Instala dependências globais
RUN npm install -g @nestjs/cli

# Copia os arquivos de dependência primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

# Compila o projeto
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]