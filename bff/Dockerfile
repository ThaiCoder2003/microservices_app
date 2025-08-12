# Cấu hình Dockerfile cho bff
# Bắt đầu với Node.js image
FROM node:20

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép các file package cần thiết để cài đặt dependencies
# Tận dụng Docker layer caching để tăng tốc độ build
COPY bff/package*.json ./
COPY package*.json ./
# Run npm install ngay sau khi copy package.json để cache dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của service vào container
COPY bff/. .

# Mở port cho ứng dụng
EXPOSE 5000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]