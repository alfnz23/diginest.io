"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Receipt,
  CheckCircle,
  Calendar,
  CreditCard,
  Mail,
} from "lucide-react";
import type { CartItem } from "@/contexts/CartContext";

interface PurchaseReceiptData {
  orderId: string;
  orderDate: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  transactionId?: string;
  downloadUrls: Array<{
    productId: string;
    productName: string;
    downloadUrl: string;
  }>;
}

interface PurchaseReceiptProps {
  receiptData: PurchaseReceiptData;
  onDownloadReceipt?: () => void;
  onPrint?: () => void;
}

export function PurchaseReceipt({
  receiptData,
  onDownloadReceipt,
  onPrint,
}: PurchaseReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateReceiptText = () => {
    return `
PURCHASE RECEIPT - DigiNest.io
================================

Order ID: ${receiptData.orderId}
Date: ${formatDate(receiptData.orderDate)}
Customer: ${receiptData.customerName}
Email: ${receiptData.customerEmail}

ITEMS PURCHASED:
${receiptData.items
  .map(
    (item) =>
      `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`,
  )
  .join("\n")}

PAYMENT SUMMARY:
Subtotal: $${receiptData.subtotal.toFixed(2)}
${receiptData.tax ? `Tax: $${receiptData.tax.toFixed(2)}\n` : ""}Total: $${receiptData.total.toFixed(2)}

Payment Method: ${receiptData.paymentMethod}
${receiptData.transactionId ? `Transaction ID: ${receiptData.transactionId}\n` : ""}

DOWNLOAD LINKS:
${receiptData.downloadUrls
  .map((download) => `- ${download.productName}: ${download.downloadUrl}`)
  .join("\n")}

Thank you for your purchase!
DigiNest.io - Premium Digital Products
    `.trim();
  };

  const downloadAsText = () => {
    const receipt = generateReceiptText();
    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DigiNest-Receipt-${receiptData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #333; }
            .section { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DigiNest.io</div>
            <p>Premium Digital Products</p>
            <h2>Purchase Receipt</h2>
          </div>

          <div class="section">
            <strong>Order Details:</strong><br>
            Order ID: ${receiptData.orderId}<br>
            Date: ${formatDate(receiptData.orderDate)}<br>
            Customer: ${receiptData.customerName}<br>
            Email: ${receiptData.customerEmail}
          </div>

          <div class="section">
            <strong>Items Purchased:</strong>
            ${receiptData.items
              .map(
                (item) => `
              <div class="item">
                <span>${item.name} (${item.quantity}x)</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <div class="item">
              <span>Subtotal:</span>
              <span>$${receiptData.subtotal.toFixed(2)}</span>
            </div>
            ${
              receiptData.tax
                ? `
              <div class="item">
                <span>Tax:</span>
                <span>$${receiptData.tax.toFixed(2)}</span>
              </div>
            `
                : ""
            }
            <div class="item total">
              <span>Total:</span>
              <span>$${receiptData.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="section">
            <strong>Payment Method:</strong> ${receiptData.paymentMethod}<br>
            ${receiptData.transactionId ? `<strong>Transaction ID:</strong> ${receiptData.transactionId}<br>` : ""}
          </div>

          <div class="section">
            <strong>Download Links:</strong><br>
            ${receiptData.downloadUrls
              .map(
                (download) => `
              <div style="margin: 5px 0;">
                • ${download.productName}<br>
                <small style="color: #666;">${download.downloadUrl}</small>
              </div>
            `,
              )
              .join("")}
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at support@diginest.io</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <CardTitle className="text-2xl text-green-700">
            Purchase Complete!
          </CardTitle>
        </div>
        <p className="text-green-600">
          Your digital products are ready for download
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Order Header */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-neutral-600" />
            <div>
              <h3 className="font-semibold text-lg">
                Order #{receiptData.orderId}
              </h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="h-4 w-4" />
                {formatDate(receiptData.orderDate)}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        </div>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-neutral-900">
              Customer Information
            </h4>
            <div className="text-sm text-neutral-600">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {receiptData.customerEmail}
              </p>
              <p className="mt-1">{receiptData.customerName}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-neutral-900">
              Payment Information
            </h4>
            <div className="text-sm text-neutral-600">
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {receiptData.paymentMethod}
              </p>
              {receiptData.transactionId && (
                <p className="mt-1 font-mono text-xs">
                  ID: {receiptData.transactionId}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-900">Items Purchased</h4>
          {receiptData.items.map((item, index) => (
            <div
              key={`receipt-item-${item.id}-${index}`}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div className="flex-1">
                <h5 className="font-medium">{item.name}</h5>
                <p className="text-sm text-neutral-600">{item.description}</p>
                <p className="text-xs text-neutral-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-neutral-600">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Payment Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${receiptData.subtotal.toFixed(2)}</span>
          </div>
          {receiptData.tax && (
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>${receiptData.tax.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${receiptData.total.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Downloads */}
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-900">Your Downloads</h4>
          <div className="grid gap-3">
            {receiptData.downloadUrls.map((download, index) => (
              <div
                key={`download-${download.productId}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50"
              >
                <div>
                  <p className="font-medium">{download.productName}</p>
                  <p className="text-xs text-neutral-600">Ready for download</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={downloadAsText}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button
            onClick={printReceipt}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Print Receipt
          </Button>
          {onDownloadReceipt && (
            <Button onClick={onDownloadReceipt} variant="outline">
              Save as PDF
            </Button>
          )}
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Need Help?</p>
          <p>
            Contact our support team at{" "}
            <a
              href="mailto:support@diginest.io"
              className="text-blue-600 hover:underline"
            >
              support@diginest.io
            </a>
          </p>
          <p className="mt-1">
            We're here to help with any questions about your purchase!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PurchaseReceipt;
