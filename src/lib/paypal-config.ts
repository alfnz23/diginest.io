import type { CartItem } from "@/contexts/CartContext";

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb_test_client_id';

// Production readiness check
const isProduction = process.env.NODE_ENV === 'production';
const isTestMode = PAYPAL_CLIENT_ID.includes('sb_') || PAYPAL_CLIENT_ID === 'sb_test_client_id';

if (isProduction && isTestMode) {
  console.warn('⚠️  WARNING: Using PayPal sandbox credentials in production! Please update to live credentials.');
}

export interface PayPalOrderDetails {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
      breakdown: {
        item_total: {
          currency_code: string;
          value: string;
        };
        tax_total?: {
          currency_code: string;
          value: string;
        };
      };
    };
    items: Array<{
      name: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
      quantity: string;
      description?: string;
      category: 'DIGITAL_GOODS';
    }>;
  }>;
}

interface PayPalOrderData {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units: Array<{
    items: Array<{
      name: string;
      quantity: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
    }>;
  }>;
  create_time: string;
  // Additional properties for order data storage
  cartItems?: CartItem[];
  customerInfo?: {
    email: string;
    name: string;
    userId?: string;
  };
  orderTotal?: number;
  currency?: string;
}

interface StoredOrderData {
  cartItems: CartItem[];
  customerInfo: {
    email: string;
    name: string;
    userId?: string;
  };
  orderTotal: number;
  currency: string;
}

interface ProcessedOrder {
  id: string;
  paypalOrderId: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  downloadUrls: Array<{
    productId: string;
    productName: string;
    downloadUrl: string;
  }>;
}

class PayPalService {
  private baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://same-gbaeolh4sfm-latest.netlify.app'
    : 'http://localhost:3000';

  // Create PayPal order
  async createOrder(
    cartItems: CartItem[],
    customerInfo: { email: string; name: string; userId?: string },
    currency = 'USD'
  ): Promise<PayPalOrderDetails> {
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      // Create order structure
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `order_${Date.now()}`,
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: subtotal.toFixed(2)
              },
              tax_total: {
                currency_code: currency,
                value: tax.toFixed(2)
              }
            }
          },
          items: cartItems.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: currency,
              value: item.price.toFixed(2)
            },
            quantity: item.quantity.toString(),
            description: item.description,
            category: 'DIGITAL_GOODS' as const
          })),
          custom_id: customerInfo.userId || 'guest'
        }],
        payer: {
          name: {
            given_name: customerInfo.name.split(' ')[0] || customerInfo.name,
            surname: customerInfo.name.split(' ').slice(1).join(' ') || ''
          },
          email_address: customerInfo.email
        },
        application_context: {
          return_url: `${this.baseUrl}/checkout/success?provider=paypal`,
          cancel_url: `${this.baseUrl}/checkout/cancel`,
          brand_name: 'DigiNest.io',
          locale: 'en-US',
          landing_page: 'BILLING',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW'
        }
      };

      // In a real implementation, this would call your backend API
      // For demo purposes, we'll simulate the response
      const mockOrder: PayPalOrderDetails = {
        id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'CREATED',
        amount: {
          currency_code: currency,
          value: total.toFixed(2)
        },
        payer: {
          name: {
            given_name: customerInfo.name.split(' ')[0] || customerInfo.name,
            surname: customerInfo.name.split(' ').slice(1).join(' ') || ''
          },
          email_address: customerInfo.email
        },
        purchase_units: orderData.purchase_units
      };

      // Store order data locally for demo
      const storedData: StoredOrderData = {
        cartItems,
        customerInfo,
        orderTotal: total,
        currency
      };
      this.storeOrderData(mockOrder.id, storedData);

      return mockOrder;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  // Capture PayPal payment
  async captureOrder(orderId: string): Promise<PayPalOrderDetails> {
    try {
      // In production, call your backend API to capture the payment
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      return response.json();
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      throw error;
    }
  }

  // Handle successful PayPal payment
  async handleSuccessfulPayment(orderId: string) {
    try {
      const orderData = this.getOrderData(orderId);
      if (!orderData) {
        throw new Error('Order data not found');
      }

      // Create order record
      const order: ProcessedOrder = {
        id: `order_${Date.now()}`,
        paypalOrderId: orderId,
        customerId: orderData.customerInfo?.userId,
        customerEmail: orderData.customerInfo?.email || '',
        customerName: orderData.customerInfo?.name || '',
        items: orderData.cartItems || [],
        total: orderData.orderTotal || 0,
        currency: orderData.currency || 'USD',
        status: 'completed',
        paymentMethod: 'paypal',
        createdAt: new Date().toISOString(),
        downloadUrls: (orderData.cartItems || []).map(item => ({
          productId: item.id,
          productName: item.name,
          downloadUrl: item.downloadUrl || `/downloads/${item.id}.zip`
        }))
      };

      // Store order (in production, save to database)
      this.storeOrder(order);

      // Send confirmation email
      await this.sendOrderConfirmation(order);

      return order;
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      throw error;
    }
  }

  // PayPal subscription management for recurring products
  async createSubscription(planId: string, customerId: string) {
    try {
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, customerId })
      });
      return response.json();
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw error;
    }
  }

  // PayPal refund management
  async createRefund(captureId: string, amount?: number, currency = 'USD') {
    try {
      const response = await fetch('/api/paypal/create-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captureId, amount, currency })
      });
      return response.json();
    } catch (error) {
      console.error('Error creating PayPal refund:', error);
      throw error;
    }
  }

  // Get PayPal payment analytics
  async getPaymentAnalytics(startDate: string, endDate: string) {
    try {
      const response = await fetch(`/api/paypal/analytics?start=${startDate}&end=${endDate}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching PayPal analytics:', error);
      throw error;
    }
  }

  // Currency conversion for international payments
  getCurrencyOptions() {
    return [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
      { code: 'KRW', symbol: '₩', name: 'Korean Won' },
      { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
    ];
  }

  // Convert prices based on currency
  async convertPrice(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    // In production, use a real exchange rate API
    const exchangeRates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.73,
      'CAD': 1.25,
      'AUD': 1.35,
      'JPY': 110,
      'CNY': 6.5,
      'KRW': 1200,
      'BRL': 5.2,
      'INR': 75
    };

    const usdAmount = amount / (exchangeRates[fromCurrency] || 1);
    return usdAmount * (exchangeRates[toCurrency] || 1);
  }

  // Local storage helpers (for demo purposes)
  private storeOrderData(orderId: string, data: StoredOrderData) {
    localStorage.setItem(`paypal_order_${orderId}`, JSON.stringify(data));
  }

  private getOrderData(orderId: string): StoredOrderData | null {
    const data = localStorage.getItem(`paypal_order_${orderId}`);
    return data ? JSON.parse(data) : null;
  }

  private storeOrder(order: ProcessedOrder) {
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('user_orders', JSON.stringify(existingOrders));
  }

  private async sendOrderConfirmation(order: ProcessedOrder) {
    // Integrate with email service
    console.log('Sending PayPal order confirmation email...', order);

    // Example email service integration - commented out for demo
    // try {
    //   await emailService.send({
    //     to: order.payer?.email_address,
    //     template: 'paypal-order-confirmation',
    //     data: order
    //   });
    // } catch (error) {
    //   console.error('Failed to send PayPal order confirmation:', error);
    // }
  }
}

export const paypalService = new PayPalService();

// PayPal configuration options
export const paypalConfig = {
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  'data-client-token': '',
  'enable-funding': 'venmo,paylater',
  'disable-funding': '',
  'data-sdk-integration-source': 'button-factory',
  components: 'buttons,marks,funding-eligibility,payment-fields'
};

// PayPal button styling
export const paypalButtonStyle = {
  layout: 'vertical' as const,
  color: 'blue' as const,
  shape: 'rect' as const,
  label: 'paypal' as const,
  height: 45,
  tagline: false,
  borderRadius: 6
};
