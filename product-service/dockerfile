FROM node:20

WORKDIR /app

COPY package*.json ./
COPY ../kafka-wrapper ./kafka-wrapper
COPY ../kafka-wrapper/package*.json ./kafka-wrapper/

RUN npm install

COPY . .

EXPOSE 5002
CMD ["npm", "start"]
