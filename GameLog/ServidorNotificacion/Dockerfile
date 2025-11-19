FROM node:22.14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1236
CMD ["npm", "start"]