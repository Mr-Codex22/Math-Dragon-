# Imagen oficial ligera de Node
FROM node:20-alpine

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero (mejor cache)
COPY package*.json ./

# Instalar dependencias en modo producción
RUN npm install --omit=dev

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto que usa Express
EXPOSE 3000

# Variables por defecto (se pueden sobreescribir)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar el bot
CMD ["npm", "start"]