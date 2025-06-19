# 1. Base image
FROM node:22-alpine

# 2. Đặt thư mục làm việc trong container
WORKDIR /app

# 3. Copy package.json và install trước (tận dụng layer cache)
COPY package*.json ./
RUN npm install 

# 4. Copy toàn bộ source code
COPY . .

RUN npm run build


# 6. Khai báo port
EXPOSE 3004

# 7. Command để start app
CMD ["node", "dist/main.js"]

