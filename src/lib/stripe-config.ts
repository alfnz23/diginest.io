import { loadStripe, type Stripe } from '@stripe/stripe-js';
import type { Product, CartItem } from '@/contexts/CartContext';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QgXFhAVD2VJ7sKJKkLXb8XvIm7eOAbWsaIIiLh2HtEZKCYlg6BYmlWZqWu6pGS9gGWRsQgeLzH3TW3xYFgQVfCg00W7p5JzqD';

// Production readiness check
const isProduction = process.env.NODE_ENV === 'production';
const isTestMode = STRIPE_PUBLISHABLE_KEY.includes('pk_test_');

if (isProduction && isTestMode) {
  console.warn('⚠️  WARNING: Using Stripe test keys in production! Please update to live keys.');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface StripeCheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email?: string;
}

export interface PaymentMetadata {
  cartItems: CartItem[];
  customerInfo: {
    email: string;
    name: string;
    userId?: string;
  };
  orderTotal: number;
}

interface OrderData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail?: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
}

interface ProcessedStripeOrder {
  id: string;
  sessionId: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
  downloadUrls: Array<{
    productId: string;
    productName: string;
    downloadUrl: string;
  }>;
}

class StripeService {
  private baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://same-gbaeolh4sfm-latest.netlify.app'
    : 'http://localhost:3000';

  // Create checkout session
  async createCheckoutSession(
    cartItems: CartItem[],
    customerInfo: { email: string; name: string; userId?: string }
  ): Promise<StripeCheckoutSession> {
    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
            metadata: {
              productId: item.id,
              category: item.category,
              downloadUrl: item.downloadUrl || ''
            }
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // In a real implementation, this would call your backend API
      // For now, we'll simulate the response
      const mockSession: StripeCheckoutSession = {
        id: `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: `${this.baseUrl}/checkout/mock-stripe?session_id=cs_mock_${Date.now()}`,
        payment_status: 'unpaid',
        amount_total: Math.round(orderTotal * 100),
        currency: 'usd',
        customer_email: customerInfo.email
      };

      // Store session data locally for demo purposes
      this.storeSessionData(mockSession.id, {
        cartItems,
        customerInfo,
        orderTotal
      });

      return mockSession;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  // Create real Stripe checkout session (backend implementation)
  async createRealCheckoutSession(
    cartItems: CartItem[],
    customerInfo: { email: string; name: string; userId?: string }
  ): Promise<StripeCheckoutSession> {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        customerInfo,
        successUrl: `${this.baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${this.baseUrl}/checkout/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  // Retrieve checkout session
  async retrieveSession(sessionId: string): Promise<StripeCheckoutSession | null> {
    try {
      // In production, call your backend API
      const response = await fetch(`/api/checkout-session/${sessionId}`);
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  // Handle successful payment
  async handleSuccessfulPayment(sessionId: string) {
    const sessionData = this.getSessionData(sessionId);
    if (!sessionData) {
      throw new Error('Session not found');
    }

    // Create order record
    const order: ProcessedStripeOrder = {
      id: `order_${Date.now()}`,
      sessionId,
      customerId: sessionData.customerInfo?.userId,
      customerEmail: sessionData.customerInfo?.email || '',
      customerName: sessionData.customerInfo?.name || '',
      items: sessionData.cartItems || [],
      total: sessionData.orderTotal || 0,
      status: 'completed',
      createdAt: new Date().toISOString(),
      downloadUrls: (sessionData.cartItems || []).map(item => ({
        productId: item.id,
        productName: item.name,
        downloadUrl: item.downloadUrl || `/downloads/${item.id}.zip`
      }))
    };

    // Store order (in production, save to database)
    this.storeOrder(order);

    // Send confirmation email (integrate with your email service)
    await this.sendOrderConfirmation(order);

    return order;
  }

  // Payment methods management
  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    // In production, call Stripe API to attach payment method
    try {
      const response = await fetch('/api/attach-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, paymentMethodId })
      });
      return response.json();
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  }

  // Subscription management for digital products
  async createSubscription(customerId: string, priceId: string) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, priceId })
      });
      return response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Refund management
  async createRefund(chargeId: string, amount?: number) {
    try {
      const response = await fetch('/api/create-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chargeId, amount })
      });
      return response.json();
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  // Analytics and reporting
  async getPaymentAnalytics(startDate: string, endDate: string) {
    try {
      const response = await fetch(`/api/payment-analytics?start=${startDate}&end=${endDate}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error;
    }
  }

  // Local storage helpers (for demo purposes)
  private storeSessionData(sessionId: string, data: PaymentMetadata) {
    localStorage.setItem(`stripe_session_${sessionId}`, JSON.stringify(data));
  }

  private getSessionData(sessionId: string): PaymentMetadata | null {
    const data = localStorage.getItem(`stripe_session_${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  private storeOrder(order: ProcessedStripeOrder) {
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('user_orders', JSON.stringify(existingOrders));
  }

  private async sendOrderConfirmation(order: ProcessedStripeOrder) {
    // Integrate with email service (SendGrid, Mailchimp, etc.)
    console.log('Sending order confirmation email...', order);
  }
}

export const stripeService = new StripeService();
