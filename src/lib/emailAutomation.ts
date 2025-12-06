import type { User } from "@/contexts/AuthContext";
import type { Product } from "@/contexts/CartContext";

// Email automation types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  trigger: EmailTrigger;
  delay?: number; // delay v hodinách
}

export interface EmailTrigger {
  type:
    | "welcome"
    | "abandoned_cart"
    | "product_recommendation"
    | "purchase_confirmation"
    | "newsletter";
  conditions?: Record<string, string | number | boolean>;
}

export interface EmailEvent {
  id: string;
  userId: string;
  type: EmailTrigger["type"];
  data?: Record<string, string | number | boolean | Product[]>;
  scheduledAt: Date;
  sentAt?: Date;
  status: "pending" | "sent" | "failed" | "cancelled";
}

interface EmailStats {
  totalSent: number;
  totalPending: number;
  totalFailed: number;
  byType: Record<string, number>;
}

// Mock email service - v produkci napoj na skutečný provider (Resend, SendGrid, Mailgun…)
class EmailAutomationService {
  private events: EmailEvent[] = [];
  private templates: EmailTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.startEventProcessor();
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: "welcome-1",
        name: "Welcome Email 1",
        subject:
          "Welcome to DigiNest.io! Your journey to productivity starts here 🚀",
        trigger: { type: "welcome" },
        delay: 0,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f2937; text-align: center;">Welcome to DigiNest.io!</h1>
            <p>Hi there,</p>
            <p>Thank you for joining DigiNest.io! We're excited to help you discover amazing digital products that will boost your productivity and creativity.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Get Started:</h3>
              <ul style="color: #4b5563;">
                <li>Browse our curated collection of digital planners</li>
                <li>Check out our bestselling productivity eBooks</li>
                <li>Join thousands of users who've transformed their workflow</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="/products" style="background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Shopping
              </a>
            </p>

            <p>Best regards,<br>The DigiNest.io Team</p>
          </div>
        `,
      },
      {
        id: "welcome-2",
        name: "Welcome Email 2 - Tips",
        subject: "Pro tips to get the most out of your digital products 💡",
        trigger: { type: "welcome" },
        delay: 24,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f2937;">Pro Tips for Digital Product Success</h1>
            <p>Hi there,</p>
            <p>Now that you're part of the DigiNest.io community, here are some insider tips to maximize your digital products:</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="color: #4b5563;">
                <li>Set up a dedicated folder system for all your downloads</li>
                <li>Use cloud storage to access your products from anywhere</li>
                <li>Schedule weekly review sessions to apply what you've learned</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="/products" style="background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Explore More Products
              </a>
            </p>

            <p>Keep creating,<br>The DigiNest.io Team</p>
          </div>
        `,
      },
      {
        id: "abandoned-cart-1",
        name: "Abandoned Cart Reminder",
        subject: "Did you forget something? 🛒",
        trigger: { type: "abandoned_cart" },
        delay: 1,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f2937;">You left something behind!</h1>
            <p>Hi there,</p>
            <p>We noticed you left some amazing digital products in your cart. Complete your purchase to start using them right away:</p>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>Cart items summary here</p>
            </div>

            <p style="text-align: center;">
              <a href="/cart" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Return to Cart
              </a>
            </p>

            <p>Need help?<br>Reply to this email and we'll be happy to assist.</p>
          </div>
        `,
      },
      {
        id: "product-recommendation-1",
        name: "Product Recommendations",
        subject: "Handpicked digital products just for you ✨",
        trigger: { type: "product_recommendation" },
        delay: 48,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f2937;">Products We Think You'll Love</h1>
            <p>Hi there,</p>
            <p>Based on your interests, we've handpicked some new arrivals just for you:</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>Recommended products for you</p>
            </div>

            <p style="text-align: center;">
              <a href="/products" style="background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Shop Recommendations
              </a>
            </p>
          </div>
        `,
      },
    ];
  }

  // Trigger email automation
  public async triggerEmail(
    type: EmailTrigger["type"],
    userId: string,
    data?: Record<string, string | number | boolean | Product[]>,
  ) {
    const templates = this.templates.filter((t) => t.trigger.type === type);

    for (const template of templates) {
      const eventId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const scheduledAt = new Date();
      if (template.delay && template.delay > 0) {
        scheduledAt.setHours(scheduledAt.getHours() + template.delay);
      }

      const event: EmailEvent = {
        id: eventId,
        userId,
        type,
        // KLÍČOVÝ FIX: správné sloučení dat + templateId
        data: { ...(data || {}), templateId: template.id },
        scheduledAt,
        status: "pending",
      };

      this.events.push(event);
      console.log(
        `Email automation scheduled: ${template.name} for user ${userId}`,
      );
    }
  }

  // Process pending email events
  private startEventProcessor() {
    setInterval(() => {
      const now = new Date();
      const pendingEvents = this.events.filter(
        (event) => event.status === "pending" && event.scheduledAt <= now,
      );

      for (const event of pendingEvents) {
        this.sendEmail(event);
      }
    }, 30000); // Check every 30 seconds
  }

  private async sendEmail(event: EmailEvent) {
    try {
      const template = this.templates.find(
        (t) => t.id === event.data?.templateId,
      );
      if (!template) {
        event.status = "failed";
        return;
      }

      // Zatím jen mock – tady se v produkci napojí /api route + emailService
      console.log(
        `📧 Sending email: ${template.subject} to user ${event.userId}`,
      );

      // Simulace odeslání
      await new Promise((resolve) => setTimeout(resolve, 100));

      event.status = "sent";
      event.sentAt = new Date();

      // Store in analytics/tracking
      this.trackEmailEvent(event, template);
    } catch (error) {
      console.error("Failed to send email:", error);
      event.status = "failed";
    }
  }

  private trackEmailEvent(event: EmailEvent, template: EmailTemplate) {
    // Track email performance for analytics
    const analytics = {
      eventId: event.id,
      userId: event.userId,
      templateId: template.id,
      type: event.type,
      sentAt: event.sentAt,
      subject: template.subject,
    };

    console.log("📊 Email analytics:", analytics);

    // V produkci: poslat do GA/Mixpanel apod.
  }

  // Get email automation stats
  public getStats(): EmailStats {
    const stats: EmailStats = {
      totalSent: this.events.filter((e) => e.status === "sent").length,
      totalPending: this.events.filter((e) => e.status === "pending").length,
      totalFailed: this.events.filter((e) => e.status === "failed").length,
      byType: {},
    };

    for (const event of this.events) {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
    }

    return stats;
  }

  // Cancel email automation for user
  public cancelEmailsForUser(userId: string, type?: EmailTrigger["type"]) {
    const eventsToCancel = this.events.filter(
      (event) =>
        event.userId === userId &&
        event.status === "pending" &&
        (!type || event.type === type),
    );

    for (const event of eventsToCancel) {
      event.status = "cancelled";
    }
  }
}

// Export singleton instance
export const emailAutomation = new EmailAutomationService();

// Utility functions for common triggers
export const triggerWelcomeSeries = (user: User) => {
  emailAutomation.triggerEmail("welcome", user.id, {
    user_name: user.name,
    user_email: user.email,
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "https://diginest.io",
  });
};

export const triggerAbandonedCart = (
  userId: string,
  cartItems: Product[],
  cartTotal: number,
) => {
  emailAutomation.triggerEmail("abandoned_cart", userId, {
    cart_items: cartItems,
    cart_total: cartTotal.toFixed(2),
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "https://diginest.io",
  });
};

export const triggerProductRecommendations = (
  userId: string,
  userCategories: string[],
  recommendedProducts: Product[],
) => {
  emailAutomation.triggerEmail("product_recommendation", userId, {
    user_categories: userCategories.join(", "),
    recommended_products: recommendedProducts,
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "https://diginest.io",
  });
};
