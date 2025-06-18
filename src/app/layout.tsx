import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import ClientBody from "./ClientBody";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigiNest.io - Premium Digital Products",
  description: "Discover beautifully crafted eBooks, planners, schedulers, and digital tools designed to elevate your workflow and inspire your best work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {gaTrackingId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                if (typeof window !== 'undefined') {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaTrackingId}', {
                    page_title: 'DigiNest.io',
                    custom_map: {'custom_parameter': 'value'}
                  });
                }
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <I18nProvider>
          <AuthProvider>
            <CartProvider>
              <ClientBody>{children}</ClientBody>
            </CartProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
