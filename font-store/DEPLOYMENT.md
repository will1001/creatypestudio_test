# Vercel Deployment Guide

## Prerequisites
- GitHub repository dengan code ini
- Akun Vercel (vercel.com)
- WooCommerce site dengan API access

## 1. Setup Vercel Environment Variables

Di Vercel Dashboard, setup Environment Variables berikut:

### **Required Environment Variables:**
```
WOOCOMMERCE_URL=https://your-woocommerce-site.com/
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
```

### **Optional Environment Variables:**
```
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 2. WooCommerce API Setup

### Buat API Keys di WooCommerce:
1. Login ke WordPress admin
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **"Add Key"**
4. Masukkan:
   - **Description**: "Font Store API"
   - **Permissions**: "Read/Write"
5. Copy **Consumer Key** dan **Consumer Secret** ke Vercel

## 3. Deployment Steps

### **Option A: GitHub Integration (Recommended)**
1. Push code ke GitHub repository
2. Login ke Vercel
3. Click **"New Project"**
4. Import dari GitHub
5. Setup Environment Variables
6. Click **"Deploy"**

### **Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 4. Post-Deployment Configuration

### **Domain Setup:**
1. Di Vercel Dashboard → Project → Settings → Domains
2. Add custom domain atau gunakan default `.vercel.app`

### **WooCommerce CORS Setup:**
Tambahkan kode berikut ke `functions.php` theme WordPress:
```php
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
```

## 5. Testing

### **Test API Endpoints:**
```bash
# Products
curl https://your-domain.vercel.app/api/products?per_page=5

# Single Product
curl https://your-domain.vercel.app/api/products/62
```

### **Test Website:**
- Browse ke: `https://your-domain.vercel.app`
- Test font browsing
- Test cart functionality
- Test checkout dengan COD

## 6. Monitoring

### **Vercel Analytics:**
- Di Vercel Dashboard → Analytics
- Monitor performance dan errors

### **WooCommerce Orders:**
- Check di WordPress → WooCommerce → Orders
- Pastikan orders dari website muncul

## Troubleshooting

### **Common Issues:**

#### 1. API Connection Error
```bash
# Check Environment Variables di Vercel
vercel env ls
```

#### 2. CORS Error
Tambahkan CORS headers di WooCommerce (lihat step 4)

#### 3. Image Loading Issues
Update `remotePatterns` di `next.config.ts` dengan domain WooCommerce

#### 4. Build Error
```bash
# Local build test
npm run build
npm run preview
```

## Production Checklist

- [ ] WooCommerce API keys configured
- [ ] Environment variables set di Vercel
- [ ] CORS headers configured di WordPress
- [ ] Test checkout flow dengan COD
- [ ] Test order creation di WooCommerce
- [ ] Verify image loading
- [ ] Test mobile responsiveness
- [ ] Setup custom domain
- [ ] Configure SSL (otomatis di Vercel)

## Support

Untuk issues deployment:
1. Check Vercel build logs
2. Verify WooCommerce API access
3. Test API endpoints manual
4. Check browser console untuk errors