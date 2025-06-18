// Production Email Service for DigiNest.io
// Supports SendGrid, Mailgun, and Resend

interface EmailProvider {
  send(emailData: EmailData): Promise<EmailResult>;
}

interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, string | number | boolean>;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// SendGrid Provider
class SendGridProvider implements EmailProvider {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to }],
            dynamic_template_data: emailData.templateData || {}
          }],
          from: { email: emailData.from || process.env.EMAIL_FROM || 'noreply@diginest.io' },
          subject: emailData.subject,
          content: [
            {
              type: 'text/html',
              value: emailData.html
            }
          ],
          template_id: emailData.templateId
        })
      });

      if (response.ok) {
        return { success: true, messageId: response.headers.get('x-message-id') || 'sent' };
      }
      const error = await response.text();
      return { success: false, error: `SendGrid error: ${error}` };
    } catch (error) {
      return { success: false, error: `SendGrid error: ${error}` };
    }
  }
}

// Resend Provider
class ResendProvider implements EmailProvider {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com/emails';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from || process.env.EMAIL_FROM || 'DigiNest <noreply@diginest.io>',
          to: [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, messageId: result.id };
      }
      const error = await response.text();
      return { success: false, error: `Resend error: ${error}` };
    } catch (error) {
      return { success: false, error: `Resend error: ${error}` };
    }
  }
}

// Mailgun Provider
class MailgunProvider implements EmailProvider {
  private apiKey: string;
  private domain: string;
  private baseUrl: string;

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;
    this.baseUrl = `https://api.mailgun.net/v3/${domain}/messages`;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    try {
      const formData = new FormData();
      formData.append('from', emailData.from || process.env.EMAIL_FROM || 'DigiNest <noreply@diginest.io>');
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('html', emailData.html);
      if (emailData.text) formData.append('text', emailData.text);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, messageId: result.id };
      }
      const error = await response.text();
      return { success: false, error: `Mailgun error: ${error}` };
    } catch (error) {
      return { success: false, error: `Mailgun error: ${error}` };
    }
  }
}

// Email Templates
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to DigiNest.io! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to DigiNest.io!</h1>
          <p style="color: #e5e7eb; margin: 10px 0 0 0;">Premium digital products for modern creators</p>
        </div>

        <div style="padding: 40px; background: #f9fafb;">
          <h2 style="color: #111827; margin-bottom: 20px;">Hello {{user_name}}!</h2>

          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining DigiNest.io! We're excited to have you as part of our community of creators and digital enthusiasts.
          </p>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #111827; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>Browse our collection of premium digital products</li>
              <li>Save your favorites to your wishlist</li>
              <li>Get notified about new releases and special offers</li>
              <li>Access your purchase history anytime</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{site_url}}/products" style="background: #3b82f6; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Start Shopping →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Questions? Reply to this email or contact us at support@diginest.io
          </p>
        </div>

        <div style="background: #111827; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2025 DigiNest.io. All rights reserved.
          </p>
        </div>
      </div>
    `
  },

  orderConfirmation: {
    subject: 'Order Confirmation - {{order_id}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! ✅</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0;">Your digital products are ready</p>
        </div>

        <div style="padding: 40px; background: #f9fafb;">
          <h2 style="color: #111827; margin-bottom: 20px;">Thank you for your purchase!</h2>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #111827; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Date:</strong> {{order_date}}</p>
            <p><strong>Total:</strong> {{order_total}}</p>
            <p><strong>Payment Method:</strong> {{payment_method}}</p>
          </div>

          <div style="background: #eff6ff; padding: 30px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1d4ed8; margin-bottom: 15px;">Your Downloads</h3>
            {{download_links}}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{site_url}}/account" style="background: #3b82f6; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Purchase History →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Need help? Contact us at support@diginest.io
          </p>
        </div>

        <div style="background: #111827; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2025 DigiNest.io. All rights reserved.
          </p>
        </div>
      </div>
    `
  },

  // Abandoned cart email template - simplified for production stability
  abandonedCart: {
    subject: 'You left something in your cart 🛒',
    html: '<h1>Complete your purchase</h1><p>You have items waiting in your cart. Complete your purchase today!</p>'
  }
};

// Main Email Service
class EmailService {
  private provider: EmailProvider;

  constructor() {
    // Auto-detect provider based on environment variables
    if (process.env.SENDGRID_API_KEY) {
      this.provider = new SendGridProvider(process.env.SENDGRID_API_KEY);
    } else if (process.env.RESEND_API_KEY) {
      this.provider = new ResendProvider(process.env.RESEND_API_KEY);
    } else if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      this.provider = new MailgunProvider(process.env.MAILGUN_API_KEY, process.env.MAILGUN_DOMAIN);
    } else {
      // Fallback to console logging in development
      this.provider = new ConsoleProvider();
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<EmailResult> {
    const template = emailTemplates.welcome;
    const html = template.html
      .replace(/\{\{user_name\}\}/g, userName)
      .replace(/\{\{site_url\}\}/g, process.env.NEXT_PUBLIC_SITE_URL || 'https://diginest.io');

    return this.provider.send({
      to: userEmail,
      subject: template.subject,
      html,
      text: `Welcome to DigiNest.io! Thank you for joining our community, ${userName}.`
    });
  }

  async sendOrderConfirmation(
    userEmail: string,
    orderData: {
      orderId: string;
      orderDate: string;
      orderTotal: string;
      paymentMethod: string;
      downloadLinks: Array<{productName: string; downloadUrl: string}>;
    }
  ): Promise<EmailResult> {
    const template = emailTemplates.orderConfirmation;
    const downloadLinksHtml = orderData.downloadLinks
      .map(link => `<p><a href="${link.downloadUrl}" style="color: #1d4ed8;">${link.productName}</a></p>`)
      .join('');

    const html = template.html
      .replace(/\{\{order_id\}\}/g, orderData.orderId)
      .replace(/\{\{order_date\}\}/g, orderData.orderDate)
      .replace(/\{\{order_total\}\}/g, orderData.orderTotal)
      .replace(/\{\{payment_method\}\}/g, orderData.paymentMethod)
      .replace(/\{\{download_links\}\}/g, downloadLinksHtml)
      .replace(/\{\{site_url\}\}/g, process.env.NEXT_PUBLIC_SITE_URL || 'https://diginest.io');

    return this.provider.send({
      to: userEmail,
      subject: template.subject.replace(/\{\{order_id\}\}/g, orderData.orderId),
      html,
      text: `Order ${orderData.orderId} confirmed. Total: ${orderData.orderTotal}. Download your products from your account.`
    });
  }

  async sendAbandonedCartEmail(
    userEmail: string,
    cartData: {
      cartTotal: string;
      cartItems: Array<{name: string; price: string}>;
    }
  ): Promise<EmailResult> {
    const template = emailTemplates.abandonedCart;
    const html = `${template.html}<p>Cart total: ${cartData.cartTotal}</p>`;

    return this.provider.send({
      to: userEmail,
      subject: template.subject,
      html,
      text: `You left items in your cart worth ${cartData.cartTotal}. Complete your purchase at DigiNest.io`
    });
  }
}

// Console Provider for Development
class ConsoleProvider implements EmailProvider {
  async send(emailData: EmailData): Promise<EmailResult> {
    console.log('📧 EMAIL WOULD BE SENT:');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('HTML Preview:', `${emailData.html.substring(0, 200)}...`);
    return { success: true, messageId: `console-${Date.now()}` };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types for use in other files
export type { EmailData, EmailResult };
