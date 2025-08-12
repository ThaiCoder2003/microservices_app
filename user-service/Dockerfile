# Cấu hình Dockerfile cho user-service
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file package và thư mục kafka-wrapper
COPY user-service/package*.json ./
COPY package*.json ./
COPY kafka-wrapper ./kafka-wrapper

# Copy package.json and package-lock.json to leverage Docker's build cache
COPY package*.json ./

# Install dependencies
RUN npm install

COPY user-service/. .

# Khai báo port service lắng nghe
EXPOSE 5001
CMD ["npm", "start"]
