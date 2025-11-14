# FontStore - Premium Font Marketplace

A modern e-commerce platform for buying and selling premium fonts, built with Next.js and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Font Browsing**: Browse and discover premium fonts with advanced filtering and search
- **Font Categories**: Organized by Sans Serif, Serif, Script, Display, Monospace
- **Detailed Font Pages**: In-depth information, preview, and licensing options
- **Shopping Cart**: Add fonts to cart with different license types (Personal, Commercial, Extended)
- **Checkout Process**: Secure payment processing simulation
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Next.js 16**: Latest React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Context API**: State management for shopping cart
- **LocalStorage**: Persistent cart data

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd font-store
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
font-store/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/          # About page
│   │   ├── cart/           # Shopping cart page
│   │   ├── checkout/       # Checkout process
│   │   ├── fonts/          # Font browsing and detail pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable React components
│   │   ├── Footer.tsx      # Footer component
│   │   └── Header.tsx      # Header with navigation
│   ├── contexts/           # React Context providers
│   │   └── CartContext.tsx # Shopping cart state management
│   ├── lib/                # Utility libraries and data
│   │   └── fonts-data.ts   # Sample font data
│   └── types/              # TypeScript type definitions
│       └── font.ts         # Font-related types
├── public/                 # Static assets
└── README.md
```

## 🎨 Pages and Routes

### `/` - Homepage
- Hero section with call-to-action
- Featured fonts showcase
- Category browsing
- New arrivals section
- Statistics and trust indicators

### `/fonts` - Font Catalog
- Grid/List view toggle
- Advanced filtering by category
- Sort by popularity, rating, price, newest
- Search functionality
- Font cards with preview

### `/fonts/[id]` - Font Detail Page
- Interactive font preview
- Customizable preview text and size
- License options (Personal, Commercial, Extended)
- Font specifications and features
- Related fonts recommendations
- Add to cart functionality

### `/cart` - Shopping Cart
- Cart item management
- Quantity adjustments
- Price calculations with tax
- Remove items functionality
- Proceed to checkout

### `/checkout` - Checkout Process
- Billing information form
- Payment method selection
- Order summary
- Form validation
- Payment processing simulation
- Success confirmation

### `/about` - About Page
- Company story and mission
- Core values and statistics
- Team information placeholder

## 🛒 E-commerce Features

### Cart Management
- Add fonts with different license types
- Persistent cart using localStorage
- Real-time price calculations
- Quantity adjustments

### Licensing System
- **Personal License**: Basic personal use
- **Commercial License**: Business and commercial use
- **Extended License**: Resale and mass distribution

### Payment Processing
- Secure checkout form
- Billing information collection
- Payment method selection
- Order confirmation and success page

## 🎯 Key Components

### Header Component
- Responsive navigation menu
- Search functionality
- Shopping cart indicator with item count
- Mobile menu support

### Footer Component
- Multi-column layout
- Quick links and navigation
- Social media links
- Legal and policy pages

### Cart Context
- Global cart state management
- Add/remove/update operations
- Price calculations
- localStorage persistence

## 🎨 Design System

### Colors
- Primary: Blue (#2563EB)
- Secondary: Gray variants
- Success: Green (#059669)
- Error: Red (#DC2626)

### Typography
- Clean, modern sans-serif for UI
- Font previews showcase actual font families
- Responsive typography scale

### Layout
- Mobile-first approach
- Responsive grid system
- Consistent spacing using Tailwind
- Card-based design for content

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Technologies Used
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Context**: State management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 WooCommerce API Testing

Use the bundled Postman assets under `postman/` to poke the WooCommerce store that runs inside LocalWP (`https://creatypestudiobackend.local`).

1. Import `postman/woocommerce-localwp.postman_collection.json` into Postman.
2. Import `postman/localwp-woocommerce.postman_environment.json`, select it, and confirm the default variables:
   - `baseUrl` (`https://creatypestudiobackend.local`)
   - `consumerKey` / `consumerSecret` (already filled with the provided REST credentials)
   - `productId` and `orderId` placeholders (set them to real IDs from your catalog/orders before running the related requests).
3. Start LocalWP so the WooCommerce site is reachable, then run the requests (health check, products, orders, customers, and mutations like create product/order and update order status). The collection now includes order presets for cash-on-delivery, credit-card (Stripe-style), and PayPal scenarios—pick the payment flow you want to simulate before sending.
4. Adjust request bodies as needed — for example, tweak the payload in **Create Product** or **Create Order** before sending to match your data.

All requests inherit Basic Auth from the collection, so Postman will automatically send the consumer key/secret when calling each WooCommerce endpoint.

Butuh panduan rinci untuk simulasi PayPal dan kartu kredit? Baca `docs/payment-testing.md` untuk langkah demi langkahnya.

## 📈 Future Enhancements

### Planned Features
- User authentication and accounts
- Font upload system for designers
- Advanced search with AI-powered recommendations
- Font pairing suggestions
- Customer reviews and ratings
- Wishlist functionality
- Download history
- Font customization tools

### Technical Improvements
- Database integration (PostgreSQL/MongoDB)
- Payment gateway integration (Stripe/PayPal)
- Image optimization and CDN
- SEO optimization
- Performance monitoring
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact our support team
- Check our documentation

---

Built with ❤️ using Next.js and Tailwind CSS
