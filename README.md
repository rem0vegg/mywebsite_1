Laporan DevSecOps Pipeline -- mywebsite_1
Anggota Kelompok

rem0vegg = Gregorius Ramothy Lumban Raja
Snozz1gh = Matthew Mayfield Mandey
jollyscenery = Karta Jethro Daron Anugrah
wilborgg = Wilbert Giovanni Archie

Tentang Aplikasi
mywebsite_1 adalah sebuah aplikasi web sederhana berbasis Node.js yang berfungsi sebagai Starter Template Microservice. Meskipun tampilannya berupa halaman "Hello World", konteks sesungguhnya dari proyek ini adalah sebagai fondasi awal sebuah layanan mikro yang nantinya akan diintegrasikan ke dalam sistem yang lebih besar. Aplikasi ini dikemas menggunakan Docker dan Nginx, sehingga siap untuk di-deploy di berbagai lingkungan (development maupun production) secara konsisten dan terisolasi.

Pipeline CI/CD
Pipeline diimplementasikan melalui GitHub Actions menggunakan file devsecops.yml. Pipeline ini berjalan secara otomatis setiap kali ada push atau pull request ke branch main maupun feature/security.
Alur kerja pipeline dimulai dengan tahap Continuous Integration di mana sistem secara otomatis mengunduh seluruh dependensi menggunakan npm ci dan memverifikasi bahwa build aplikasi berjalan dengan benar di lingkungan Ubuntu terbaru. Karena aplikasi ini dirancang sebagai starter template microservice yang akan terhubung dengan layanan lain, setiap perubahan kode harus dipastikan tidak merusak build sebelum bisa digabungkan ke branch utama.

Fitur Keamanan (Security Features)
Karena proyek ini adalah starter template microservice yang dirancang untuk diintegrasikan ke sistem yang lebih besar, standar keamanan harus diterapkan sejak awal sebelum kode berkembang lebih jauh. Tiga fitur keamanan berikut dipilih untuk membangun lapisan pertahanan yang saling melengkapi:

1. SCA -> Software Composition Analysis (npm audit)

Tool yang digunakan adalah npm audit bawaan Node.js. Pada konteks microservice, aplikasi sangat bergantung pada library pihak ketiga dari ekosistem npm. Jika salah satu library memiliki kerentanan yang belum dipatch, seluruh layanan yang bergantung padanya bisa ikut terdampak. npm audit memindai seluruh dependency dan menghasilkan laporan yang disimpan sebagai artefak audit-results.json sehingga tim keamanan bisa meninjau hasilnya kapan saja. Hasil scan: 0 vulnerabilities found

2. Secret Scanning (Gitleaks)

Tool yang digunakan adalah Gitleaks. Pada microservice, sangat umum ditemukan API key, database token, atau service credential yang ditulis langsung di dalam kode secara tidak sengaja. Jika secret tersebut terpublish ke repository publik, dampaknya bisa sangat besar karena satu microservice yang bocor bisa membuka akses ke seluruh sistem. Gitleaks mendeteksi hal ini secara otomatis sebelum kode sempat dipublikasikan. Hasil scan: no leaks found, 6 commits scanned, ~1964 bytes (1.96 KB) dalam 171ms.

3. SAST -> Static Application Security Testing (CodeQL)

Tool yang digunakan adalah CodeQL dari GitHub. Sebagai template yang kodenya akan dikembangkan lebih lanjut oleh anggota tim lain, penting untuk mendeteksi celah logika seperti Cross-Site Scripting (XSS) atau injection attack sejak kode masih di tahap development. CodeQL menganalisis struktur kode JavaScript secara mendalam tanpa perlu menjalankan aplikasinya. Hasilnya bisa dilihat langsung di tab Security > Code scanning alerts pada repository.

Hasil Pipeline

Pipeline telah berhasil dijalankan sebanyak 15 kali dengan run terbaru semuanya berstatus sukses (hijau). Iterasi run sebelumnya yang gagal merupakan bagian normal dari proses debugging dan penyempurnaan konfigurasi pipeline, mulai dari perbaikan package-lock.json, permission workflow, hingga penambahan script.js agar CodeQL dapat menganalisis kode JavaScript. Artefak hasil scan audit-results.json tersedia di tab Actions sebagai bukti hasil pemindaian npm audit yang dapat ditinjau oleh tim kapan saja.
