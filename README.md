# 🚀 DigiNest.io - Premium Digital Products Marketplace

**Version 40** - Production Ready with ALL Hydration Fixes ✅

A modern, full-featured e-commerce platform for digital products built with Next.js 15, TypeScript, and Tailwind CSS.

> **🔧 Version 39 Fixes:** Resolved localStorage hydration errors, fixed category navigation, and eliminated "Application error: a client-side exception has occurred" in production deployments.

![DigiNest.io Preview](https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg)

## ✨ Features

### 🎨 Design & UX
- **Blueprint Background**: Animated technical drawings with moving particles
- **Interactive Robot Companion**: Emotion-responsive AI assistant
- **Responsive Design**: Mobile-first approach with seamless tablet/desktop scaling
- **Modern UI**: Clean, professional design with Shadcn/UI components

### 🛒 E-commerce Features
- **Product Catalog**: 42+ digital products across 6 categories
- **Smart Filtering**: Category, price, rating, and search filters
- **Shopping Cart**: Full cart management with quantity updates
- **Secure Checkout**: Stripe & PayPal payment integration
- **Receipt System**: Professional receipt generation with download/print

### 🌍 International Support
- **Multi-language**: 9 languages (EN, ES, FR, DE, PT, IT, JA, KO, ZH)
- **Currency Conversion**: Auto-conversion based on user location
- **Localized Content**: Proper formatting for dates, numbers, currencies

### 📧 Email Automation
- **Welcome Series**: Automated onboarding emails
- **Order Confirmation**: Professional order receipts via email
- **Abandoned Cart**: Recovery email campaigns
- **Multi-provider Support**: SendGrid, Mailgun, Resend integration

### ⚡ Performance & Tech
- **Next.js 15**: Latest features with Turbopack
- **TypeScript**: Full type safety
- **Dynamic Imports**: Optimized bundle splitting
- **CSS Animations**: Smooth, performant animations
- **Progressive Enhancement**: Works without JavaScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/diginest-io.git
cd diginest-io

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
diginest-io/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── products/          # Products pages
│   │   ├── admin/             # Admin dashboard
│   │   └── checkout/          # Checkout flow
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── BlueprintBackground.tsx
│   │   ├── SimpleRobot.tsx
│   │   ├── StripeCheckout.tsx
│   │   └── PurchaseReceipt.tsx
│   ├── contexts/             # React contexts
│   │   ├── CartContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── I18nContext.tsx
│   ├── lib/                  # Utilities and configurations
│   │   ├── stripe-config.ts
│   │   ├── paypal-config.ts
│   │   └── emailService.ts
│   └── styles/
│       └── globals.css       # Global styles and animations
├── public/                   # Static assets
├── .same/                   # Development docs and todos
├── render.yaml              # Render.com deployment config
├── netlify.toml            # Netlify deployment config
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Payment Gateways
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DigiNest.io

# Email Service (Choose one)
SENDGRID_API_KEY=your_sendgrid_key
# or
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_domain
# or
RESEND_API_KEY=your_resend_key

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=GA_TRACKING_ID
```

### Payment Setup

#### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys
3. Add them to your environment variables

#### PayPal
1. Create a developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a new app to get client ID and secret
3. Add them to your environment variables

## 🚀 Deployment

### Render.com (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Choose "Web Service"
   - Render will automatically detect the `render.yaml` configuration

3. **Environment Variables**:
   - Add your production environment variables in Render dashboard
   - Update `NEXT_PUBLIC_SITE_URL` to your Render URL

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add your production vars
4. **Deploy**: Push to GitHub and connect to Netlify

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# With Bun
bun dev             # Start development server
bun run build       # Build for production
bun start           # Start production server
```

### Key Components

#### Blueprint Background
Animated technical drawing background with moving particles:
```tsx
import { BlueprintBackground } from '@/components/BlueprintBackground';
```

#### Robot Companion
Interactive AI assistant with emotion responses:
```tsx
import { SimpleRobot } from '@/components/SimpleRobot';
```

#### Checkout System
Complete payment flow with Stripe/PayPal:
```tsx
import { StripeCheckout } from '@/components/StripeCheckout';
```

#### Receipt System
Professional receipt generation:
```tsx
import { PurchaseReceipt } from '@/components/PurchaseReceipt';
```

## 🎨 Customization

### Adding New Products

Products are defined in `src/app/products/page.tsx`. Add new products to the `mockProducts` array:

```tsx
{
  id: "product-new",
  name: "Your Product Name",
  description: "Product description",
  price: 29.99,
  image: "https://your-image-url.com/image.jpg",
  category: "ebooks", // or planners, templates, tools, health, fitness
  rating: 4.8,
  reviews: 156,
  downloadUrl: "/downloads/your-product.zip"
}
```

### Adding New Languages

Languages are configured in `src/contexts/I18nContext.tsx`. Add new language support:

```tsx
export const supportedLanguages: LanguageOption[] = [
  // existing languages...
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€'
  },
];
```

### Styling

The project uses Tailwind CSS with custom animations. Global styles are in `src/app/globals.css`.

Custom animations for floating elements:
```css
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

## 📊 Analytics & Monitoring

### Google Analytics
Add your tracking ID to environment variables:
```bash
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Error Monitoring
Consider integrating:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Mixpanel](https://mixpanel.com) for user analytics

## 🔒 Security

### Security Headers
Configured in `netlify.toml` and `render.yaml`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### Payment Security
- All payments processed through secure providers (Stripe/PayPal)
- No sensitive payment data stored locally
- PCI compliance through payment processors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for beautiful UI components
- **Lucide React** for consistent icons
- **Next.js Team** for the amazing framework
- **Stripe & PayPal** for secure payment processing
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support, email support@diginest.io or create an issue in this repository.

---

**Built with ❤️ for the digital creator community**
