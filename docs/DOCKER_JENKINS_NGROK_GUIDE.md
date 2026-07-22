# Docker, Jenkins, and Ngrok Guide

Dokumen ini menjelaskan cara menjalankan Beatrix Movie dengan Docker, membuka aplikasi lewat ngrok untuk demo, dan menghubungkannya ke Jenkins agar proses build lebih rapi. File ini sengaja dipisahkan dari kode fitur supaya bagian DevOps mudah dibaca tanpa mengganggu struktur frontend dan backend.

## 1. File yang Ditambahkan

Konfigurasi Docker dan CI/CD berada di beberapa file berikut:

```txt
docker-compose.yml
Jenkinsfile
.env.example

backend/
  Dockerfile
  .dockerignore

frontend/
  Dockerfile
  .dockerignore
  nginx.conf

docs/
  DOCKER_JENKINS_NGROK_GUIDE.md
```

Fungsinya:

- `backend/Dockerfile` membangun container Express API.
- `frontend/Dockerfile` membangun React/Vite menjadi file static dan menjalankannya lewat Nginx.
- `frontend/nginx.conf` melayani frontend sekaligus meneruskan request `/api` ke backend container.
- `docker-compose.yml` menjalankan backend, frontend, dan optional ngrok dalam satu network.
- `Jenkinsfile` menjalankan pipeline install, build, docker build, dan optional deploy.

## 2. Persiapan Wajib

Pastikan aplikasi berikut sudah terpasang:

- Docker Desktop
- Git
- Node.js untuk menjalankan mode lokal non-Docker
- Jenkins jika ingin menjalankan pipeline otomatis
- Akun ngrok jika ingin expose aplikasi ke internet

Pastikan Docker Desktop sedang berjalan sebelum memakai command Docker.

## 3. Menyiapkan Environment Backend

Backend tetap membutuhkan `backend/.env`. File ini tidak boleh di-push ke GitHub karena berisi MongoDB URI, JWT secret, Xendit key, dan konfigurasi email.

Jika belum ada, buat dari contoh:

```bash
cd backend
copy .env.example .env
```

Di PowerShell, bisa juga:

```powershell
Copy-Item .env.example .env
```

Isi minimal yang dibutuhkan:

```txt
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster/database?retryWrites=true&w=majority
JWT_SECRET=isi-dengan-secret-yang-panjang
CLIENT_URL=http://localhost:8081,http://127.0.0.1:8081,http://localhost:5173,http://127.0.0.1:5173
XENDIT_API_KEY=xnd_development_your_sandbox_key
```

Catatan penting:

- Jangan taruh credential asli di `.env.example`.
- Jangan commit `backend/.env`.
- Untuk Docker, frontend akan dibuka dari `http://localhost:8081`.
- Untuk development biasa, frontend tetap bisa dibuka dari `http://localhost:5173`.

## 4. Menjalankan Project dengan Docker

Dari folder root project:

```bash
cd C:\Users\User\movie-booking-challenge-1
docker compose build
docker compose up -d
```

Setelah container berjalan:

```txt
Frontend: http://localhost:8081
Backend:  http://localhost:5001
```

Cek status container:

```bash
docker compose ps
```

Melihat log:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Menghentikan semua container:

```bash
docker compose down
```

## 5. Menjalankan Seed Data di Docker

Jika database masih kosong, jalankan seed dari container backend:

```bash
docker compose run --rm backend npm run seed
```

Setelah seed selesai, buka kembali:

```txt
http://localhost:8081
```

Movie catalogue dan showtime seharusnya sudah terisi.

## 6. Menambahkan Ngrok

Ngrok dipakai untuk membuat URL publik sementara. Ini berguna saat demo, testing dari HP, atau ketika teman ingin membuka aplikasi dari jaringan luar.

### 6.1 Ambil Authtoken Ngrok

1. Login ke dashboard ngrok.
2. Buka menu authtoken.
3. Copy token yang diberikan.

### 6.2 Buat File `.env` di Root Project

Di root project, buat file:

```txt
.env
```

Isi:

```txt
BACKEND_PORT=5001
FRONTEND_PORT=8081
NGROK_AUTHTOKEN=isi_token_ngrok_kamu
```

File `.env` di root juga tidak boleh di-push ke GitHub.

### 6.3 Jalankan Docker dengan Profile Ngrok

Dari root project:

```bash
docker compose --profile tunnel up -d --build
```

Cek log ngrok:

```bash
docker compose logs -f ngrok
```

Di log akan muncul URL seperti:

```txt
https://xxxx-xxxx-xxxx.ngrok-free.app
```

Buka URL tersebut di browser. Frontend akan terbuka dari URL ngrok, dan request `/api` tetap diteruskan ke backend lewat Nginx.

### 6.4 Melihat URL Ngrok dari Inspector

Jika container ngrok sudah berjalan, buka:

```txt
http://localhost:4040
```

Halaman ini menampilkan tunnel aktif dan request yang masuk.

## 7. Menghubungkan ke Jenkins

Jenkins dipakai agar build project tidak hanya bergantung pada laptop pribadi. Pipeline di repo ini memakai `Jenkinsfile`, sehingga Jenkins dapat membaca langkah build langsung dari Git.

### 7.1 Plugin Jenkins yang Dibutuhkan

Pastikan Jenkins memiliki plugin berikut:

- Pipeline
- Git
- Credentials Binding

Jika Jenkins berjalan di Windows, pastikan agent Jenkins bisa menjalankan:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
```

### 7.2 Buat Credentials untuk Backend `.env`

Di Jenkins:

1. Masuk ke `Manage Jenkins`.
2. Pilih `Credentials`.
3. Pilih scope yang sesuai, biasanya `Global`.
4. Klik `Add Credentials`.
5. Pilih jenis `Secret file`.
6. Upload file `.env` backend yang sudah berisi MongoDB, JWT, dan key lain.
7. Isi ID dengan:

```txt
beatrix-backend-env
```

Credential ini hanya dipakai saat parameter `DEPLOY_WITH_DOCKER` diaktifkan.

### 7.3 Buat Credentials untuk Ngrok

Jika ingin Jenkins menjalankan ngrok:

1. Masuk ke `Manage Jenkins`.
2. Pilih `Credentials`.
3. Klik `Add Credentials`.
4. Pilih jenis `Secret text`.
5. Paste authtoken ngrok.
6. Isi ID dengan:

```txt
beatrix-ngrok-authtoken
```

Credential ini hanya dipakai saat parameter `ENABLE_NGROK` diaktifkan.

### 7.4 Membuat Pipeline Job

Di Jenkins:

1. Klik `New Item`.
2. Isi nama, misalnya:

```txt
beatrix-movie-naufal
```

3. Pilih `Pipeline`.
4. Pada bagian `Pipeline`, pilih:

```txt
Definition: Pipeline script from SCM
SCM: Git
```

5. Isi Repository URL:

```txt
https://github.com/Bridgetbeatrixc/movie-booking-challenge-1.git
```

6. Isi branch sesuai branch kerja kamu:

```txt
*/naufal
```

7. Script Path:

```txt
Jenkinsfile
```

8. Simpan.

### 7.5 Menjalankan Build Biasa

Klik:

```txt
Build with Parameters
```

Untuk build biasa:

```txt
DEPLOY_WITH_DOCKER = false
ENABLE_NGROK = false
```

Pipeline akan menjalankan:

- `npm ci` backend
- syntax check backend
- `npm ci` frontend
- `npm run build` frontend
- `docker compose build`

Mode ini cocok untuk validasi sebelum push atau sebelum Pull Request.

### 7.6 Menjalankan Deploy dari Jenkins

Jika ingin Jenkins juga menjalankan container:

```txt
DEPLOY_WITH_DOCKER = true
ENABLE_NGROK = false
```

Jenkins akan mengambil credential `beatrix-backend-env`, menyalinnya menjadi `backend/.env`, lalu menjalankan:

```bash
docker compose up -d --build backend frontend
```

Aplikasi dapat dibuka dari mesin Jenkins:

```txt
http://localhost:8081
```

Jika Jenkins ada di server lain, buka dengan IP server tersebut:

```txt
http://IP_SERVER_JENKINS:8081
```

### 7.7 Menjalankan Deploy + Ngrok dari Jenkins

Aktifkan:

```txt
DEPLOY_WITH_DOCKER = true
ENABLE_NGROK = true
```

Jenkins akan menjalankan:

```bash
docker compose --profile tunnel up -d --build
```

Lihat URL publik dari log Jenkins atau log container:

```bash
docker compose logs ngrok
```

## 8. Alur Kerja yang Disarankan untuk Tim

Untuk kerja harian:

1. Developer mengerjakan fitur di branch masing-masing.
2. Jalankan build lokal:

```bash
cd frontend
npm run build
```

3. Jalankan Docker build:

```bash
docker compose build
```

4. Push ke branch pribadi.
5. Jenkins membaca branch dan menjalankan pipeline.
6. Jika pipeline hijau, buat Pull Request ke `main`.

Alur ini membuat `main` lebih aman karena perubahan diuji dulu sebelum digabung.

## 9. Troubleshooting

Jika backend gagal connect ke MongoDB:

- Cek `MONGODB_URI` di `backend/.env`.
- Pastikan IP publik sudah masuk MongoDB Network Access.
- Jalankan:

```bash
docker compose logs -f backend
```

Jika frontend terbuka tetapi API gagal:

- Pastikan backend container hidup:

```bash
docker compose ps
```

- Cek apakah Nginx proxy berjalan:

```bash
docker compose logs -f frontend
```

Jika ngrok tidak muncul URL:

- Pastikan `NGROK_AUTHTOKEN` sudah benar.
- Jalankan ulang:

```bash
docker compose --profile tunnel up -d --build
docker compose logs -f ngrok
```

Jika port bentrok:

- `5001` dipakai backend Docker dari host laptop.
- `5000` tetap dipakai backend di dalam container.
- `8081` dipakai frontend Docker.
- `4040` dipakai ngrok inspector.

Ubah port lewat file `.env` di root project jika salah satunya sudah dipakai aplikasi lain:

```txt
BACKEND_PORT=5002
FRONTEND_PORT=8082
```

## 10. Ringkasan Command Penting

Build Docker:

```bash
docker compose build
```

Run tanpa ngrok:

```bash
docker compose up -d
```

Run dengan ngrok:

```bash
docker compose --profile tunnel up -d --build
```

Seed database:

```bash
docker compose run --rm backend npm run seed
```

Stop:

```bash
docker compose down
```

Lihat log:

```bash
docker compose logs -f
```
