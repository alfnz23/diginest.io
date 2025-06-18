# DigiNest.io - Production Setup Guide

## 🚀 Payment Gateway Configuration

### Stripe Setup (Recommended Primary Payment)

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete account verification
   - Enable your account for live payments

2. **Get Live Credentials**
   ```bash
   # Replace in your environment variables:
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   ```

3. **Configure Webhooks**
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`

### PayPal Setup (Secondary Payment Option)

1. **Create PayPal Business Account**
   - Sign up at [paypal.com/business](https://paypal.com/business)
   - Complete business verification

2. **Get Live Credentials**
   ```bash
   # Replace in your environment variables:
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   ```

3. **Configure Webhooks**
   - In PayPal Developer Dashboard
   - Add webhook URL: `https://yourdomain.com/api/paypal/webhook`

## 🔐 Environment Variables for Production

Create a `.env.local` file with:

```bash
# Payment Gateways
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# App Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=DigiNest.io

# Security
NEXTAUTH_SECRET=your_very_long_random_secret_string
NEXTAUTH_URL=https://yourdomain.com

# Email Service (Optional - for transactional emails)
EMAIL_FROM=noreply@yourdomain.com
SENDGRID_API_KEY=your_sendgrid_key
```

## 📧 Email Configuration

### Option 1: SendGrid (Recommended)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your domain
3. Get API key and add to environment variables

### Option 2: Mailgun
1. Sign up at [mailgun.com](https://mailgun.com)
2. Add your domain
3. Configure DNS records

## 🌐 Domain & DNS Setup

1. **Purchase Domain**
   - Recommended: Namecheap, GoDaddy, or Cloudflare

2. **Configure DNS**
   ```
   Type: CNAME
   Name: www
   Value: your-netlify-domain.netlify.app

   Type: A
   Name: @
   Value: [Netlify's IP addresses]
   ```

## 🔒 SSL & Security

1. **SSL Certificate**
   - Netlify provides free SSL automatically
   - Ensure HTTPS redirect is enabled

2. **Security Headers**
   - Configure in `netlify.toml`:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       X-XSS-Protection = "1; mode=block"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

## 📊 Analytics & Monitoring

### Google Analytics
```html
<!-- Add to head in layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

### Error Monitoring
- Consider: Sentry, LogRocket, or Bugsnag

## 💳 Payment Testing

### Test Credit Cards (Stripe)
- Visa: `4242 4242 4242 4242`
- Visa (declined): `4000 0000 0000 0002`
- Mastercard: `5555 5555 5555 4444`

### PayPal Testing
- Use PayPal Sandbox accounts
- Test both PayPal and credit card flows

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Payment gateways tested
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking installed
- [ ] Error monitoring setup
- [ ] Email service configured
- [ ] Legal pages added (Terms, Privacy Policy)
- [ ] Contact information updated
- [ ] Product download links working

## 📈 Post-Launch

1. **Monitor Performance**
   - Page load times
   - Conversion rates
   - Error rates

2. **SEO Optimization**
   - Submit sitemap to Google
   - Configure meta descriptions
   - Optimize images

3. **Backup Strategy**
   - Regular database exports
   - Code repository backups

## 🎯 Revenue Optimization

1. **A/B Testing**
   - Test different pricing
   - Test product descriptions
   - Test checkout flow

2. **Email Marketing**
   - Welcome email series
   - Abandoned cart recovery
   - Product recommendations

3. **Customer Support**
   - Setup help desk
   - FAQ section
   - Live chat (optional)

---

## 🆘 Support & Troubleshooting

### Common Issues:

1. **Payment Not Processing**
   - Check API keys
   - Verify webhook endpoints
   - Check error logs

2. **SSL Issues**
   - Ensure DNS propagation complete
   - Check certificate validity

3. **Email Not Sending**
   - Verify email service configuration
   - Check spam folders
   - Validate email templates

For technical support, check the logs in Netlify Functions or contact your payment processor support.
