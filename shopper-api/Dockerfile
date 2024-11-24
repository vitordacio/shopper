# Use a imagem base Node
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./
RUN npm install

# Copie o restante do código
COPY . .

# Exponha a porta
EXPOSE 8080

# Execute o comando de inicialização
CMD ["sh", "-c", "npm run migration:run && npm run start"]
