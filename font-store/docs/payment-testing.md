# Panduan Pengujian Pembayaran WooCommerce

Langkah detail untuk menjalankan skenario pembayaran WooCommerce melalui koleksi Postman `postman/woocommerce-localwp.postman_collection.json`.

## Prasyarat
- Situs LocalWP (`https://creatypestudiobackend.local`) berjalan dan WooCommerce aktif.
- Koleksi dan environment Postman dari folder `postman/` sudah diimpor dan environment dipilih.
- `productId` mengarah ke produk yang bisa dibeli dan `orderReference` sudah diisi string unik (mis. `DEV-001`).
- Kredensial Basic Auth (`consumerKey` / `consumerSecret`) masih valid.

## Persiapan Umum
1. Di Postman, buka environment **LocalWP WooCommerce** lalu atur:
   - `productId`: ID produk yang ingin diuji.
   - `orderReference`: token unik untuk skenario PayPal (akan terlihat pada meta order).
2. Opsional: duplikasi request order bila ingin menyimpan variasi payload (kuantitas, data pelanggan, dll.).
3. Jalankan LocalWP dan pastikan `{{baseUrl}}/wp-json/` merespons (gunakan request **Health Check**).

## Alur PayPal
1. Pilih request **Create Order (PayPal)**.
2. Sesuaikan body jika perlu:
   - Ubah data `billing` / `shipping` untuk pelanggan dummy.
   - Modifikasi `line_items` untuk produk yang ingin dibeli.
   - Nilai `meta_data[0].value` sudah memakai `{{orderReference}}`; ganti variabel environment jika butuh referensi baru.
3. Kirim request. API mengembalikan order baru (status default `pending`).
4. Validasi hasil:
   - Respon memuat `payment_method: "paypal"` dan `set_paid: false`.
   - Entry meta `paypal_order_reference` harus muncul.
5. (Opsional) Pakai **Update Order Status** dengan `id` hasil respon untuk mensimulasikan capture PayPal (ubah status ke `processing` atau `completed`).

## Alur Kartu Kredit (Stripe-Style)
1. Pilih request **Create Order (Credit Card)**.
2. Edit body sesuai kebutuhan:
   - Ubah data pelanggan atau tambah baris shipping.
   - Modifikasi `line_items` untuk produk/kuantitas yang diinginkan.
   - Ganti token palsu di `meta_data` jika gateway Anda memerlukan nama/format lain (default `_card_token` / `tok_test_4242`).
3. Kirim request. Payload mengatur `set_paid: true`, sehingga WooCommerce langsung menandai order sebagai lunas.
4. Cek hasil:
   - Respon menunjukkan `payment_method: "stripe"` (atau slug yang Anda pakai) dan status biasanya `processing`/`completed`.
   - `meta_data` berisi token palsu sehingga Anda bisa melacak bagaimana backend menyimpan referensi gateway.
5. Jika perlu refund/batalkan pembayaran, jalankan **Update Order Status** dengan `id` order lalu set `cancelled`, `refunded`, dll.

## Verifikasi Lanjutan
- **WooCommerce Admin**: Buka `WooCommerce → Orders` di WP-Admin untuk memastikan order, status, total, dan metode pembayaran sudah tercatat.
- **API**: Kirim ulang **List Orders** atau request spesifik order untuk memastikan field sesuai ekspektasi.
- **Logging/Webhook**: Jika ada log khusus atau webhook, pastikan semuanya terpanggil setelah setiap uji coba.

## Tips
- Samakan `set_paid` dengan perilaku gateway yang sedang Anda tiru (kebanyakan gateway baru menandai lunas setelah capture sukses).
- Untuk gateway lain, duplikasi salah satu request yang ada, ubah slug `payment_method`, dan tambahkan metadata yang diperlukan.
- Bila bekerja tim, ekspor ulang koleksi setelah Anda modifikasi payload agar rekan bisa mengimpor versi terbaru.
