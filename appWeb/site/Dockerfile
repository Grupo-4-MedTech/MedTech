FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
EXPOSE 3333

CMD ["npm", "start"]