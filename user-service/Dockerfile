# Cấu hình Dockerfile cho user-service
FROM node:20

WORKDIR /app

# Sao chép các file package và thư mục kafka-wrapper
COPY user-service/package*.json ./
COPY package*.json ./
COPY kafka-wrapper ./kafka-wrapper

RUN npm install

COPY user-service/. .

EXPOSE 5001
CMD ["npm", "start"]