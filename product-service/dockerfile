# Cấu hình Dockerfile cho product-service
# Bắt đầu với Node.js image
FROM node:20

# Đặt thư mục làm việc trong container là /app
WORKDIR /app

# Sao chép file package.json gốc và package.json của service
COPY package*.json ./
COPY product-service/package*.json ./

# Sao chép thư mục kafka-wrapper dùng chung
COPY kafka-wrapper ./kafka-wrapper

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của service vào thư mục làm việc
COPY product-service/ .

# Mở port cho ứng dụng
EXPOSE 5002

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
