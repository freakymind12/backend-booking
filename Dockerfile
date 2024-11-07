# Menggunakan image Node.js sebagai base image
FROM node:16

# Set working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin semua file proyek ke dalam container
COPY . .

# Menetapkan port yang akan digunakan
EXPOSE 5050

# Menjalankan server preview dengan host dan port yang ditentukan
CMD ["npm", "start"]
