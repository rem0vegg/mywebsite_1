Repository

Repositori ini adalah sebuah proyek website sederhana yang dikembangkan untuk tujuan kolaborasi kelompok DevOps. Proyek ini mendemonstrasikan cara membungkus aplikasi web ke dalam kontainer (Docker) dan mengotomatisasi proses pengujian serta keamanan.

Teknologi Utama: Node.js, HTML/CSS, dan Docker.

Struktur Proyek:

- index.html & script.js: Komponen frontend aplikasi.

- package.json: Definisi dependensi Node.js (menggunakan nama proyek "devsecops-project").

- Dockerfile & docker-compose.yml: Instruksi untuk menjalankan aplikasi di dalam lingkungan terisolasi menggunakan Docker pada port 3000.

- .github/workflows/: Berisi konfigurasi otomatisasi (CI/CD) menggunakan GitHub Actions.

=============================================================================================

Pipeline (CI/CD)
Proyek ini memiliki dua alur kerja (workflow) otomatis yang berjalan di GitHub Actions:

A. DevSecOps Pipeline (devsecops.yml)
Ini adalah pipeline utama yang menggabungkan proses pembangunan aplikasi dengan pemeriksaan keamanan.

Triggers: Berjalan otomatis setiap kali ada push ke cabang main atau feature/security, serta saat ada pull_request.

Tahapan (Steps):

- Checkout & Setup: Mengambil kode sumber dan menyiapkan lingkungan Node.js versi 20.

- Dependency Check: Menjalankan npm audit untuk mencari celah keamanan pada pustaka (li-brary) yang digunakan. Hasilnya disimpan sebagai artefak.

- Secret Scanning: Menggunakan Gitleaks untuk mendeteksi jika ada kata sandi, token, atau kunci rahasia yang tidak sengaja terunggah ke kode.

- SAST (Static Application Security Testing): Menjalankan pemindaian CodeQL untuk menganalisis struktur kode JavaScript guna menemukan potensi bug atau celah keamanan.

B. CodeQL Advanced (codeql.yml)
Alur kerja ini lebih berfokus pada analisis mendalam terhadap kode sumber.

Secara otomatis mendeteksi bahasa pemrograman (dalam hal ini JavaScript/TypeScript dan GitHub Actions).

Berjalan secara rutin berdasarkan jadwal (setiap Selasa pukul 07:45) untuk memastikan kode tetap aman meskipun tidak ada perubahan baru.


=============================================================================================

Keamanan (Security)
Penerapan keamanan pada proyek ini menggunakan pendekatan Shift-Left Security, di mana setiap perubahan kode langsung diperiksa secara otomatis melalui pipeline sebelum masuk ke tahap produksi.

A. Software Composition Analysis (SCA)
Alat: npm audit.

Fungsi: Memeriksa seluruh dependensi pihak ketiga yang terdaftar di package.json untuk menemukan celah keamanan yang sudah diketahui secara publik.

Otomatisasi: Pipeline dikonfigurasi untuk memindai kerentanan dengan level "high" dan menyimpan laporannya dalam format JSON sebagai artefak.

B. Secret Scanning
Alat: Gitleaks.

Fungsi: Melakukan pemindaian pada seluruh riwayat commit untuk mendeteksi kebocoran data sensitif seperti API keys, token, atau password yang mungkin tidak sengaja terunggah.

Keamanan Repositori: Memastikan integritas repositori agar tetap bersih dari informasi rahasia yang dapat disalahgunakan pihak luar.

C. Static Application Security Testing (SAST)
Alat: CodeQL.

Fungsi: Menganalisis alur logika di dalam kode JavaScript untuk menemukan pola penulisan kode yang tidak aman, seperti potensi Cross-Site Scripting (XSS).

Fleksibilitas: Menggunakan strategi matriks untuk mendukung analisis berbagai bahasa pemrograman secara bersamaan di lingkungan pelari (runner) Ubuntu.

D. Container & Infrastructure Security
Hardening Image: Menggunakan base image node:18-alpine di dalam Dockerfile untuk meminimalkan ukuran kontainer dan mengurangi permukaan serangan (attack surface).

Docker Isolation: Aplikasi dibatasi hanya berjalan pada port 3000 untuk mengontrol akses jaringan masuk ke dalam kontainer.

Artifact Cleanup: Menggunakan mekanisme pengabaian file (seperti .git dan node_modules) agar file pengembangan tidak masuk ke dalam citra akhir kontainer.