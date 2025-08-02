import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RefundPolicyNotice from "@/components/RefundPolicyNotice";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - DigiNest.io",
  description:
    "Terms of Service and conditions for using DigiNest.io digital marketplace",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-neutral-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using DigiNest.io ("we," "our," or "us"), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Digital Products and Licenses
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">2.1 License Grant</h3>
                <p>
                  Upon successful payment, you are granted a non-exclusive,
                  non-transferable license to use the digital products purchased
                  from DigiNest.io for personal or commercial use, subject to
                  the specific license terms for each product.
                </p>

                <h3 className="text-xl font-medium">2.2 Restrictions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You may not redistribute, resell, or share the digital
                    products
                  </li>
                  <li>You may not claim authorship of the digital products</li>
                  <li>
                    You may not use the products in a way that competes with
                    DigiNest.io
                  </li>
                  <li>Bulk downloads or automated scraping is prohibited</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Payment and Refunds
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">3.1 Payment Processing</h3>
                <p>
                  All payments are processed securely through Stripe and PayPal.
                  We do not store your payment information on our servers.
                </p>

                <h3 className="text-xl font-medium">3.2 Digital Product Refund Policy</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 my-4">
                  <p className="font-medium text-orange-900 mb-2">
                    IMPORTANT: Refunds are only available for digital products that have NOT been downloaded or accessed.
                  </p>
                  <p className="text-orange-800 text-sm">
                    Once you download, access, or use any digital product, refunds are no longer possible due to the nature of digital goods.
                  </p>
                </div>

                <h4 className="text-lg font-medium">3.2.1 Refund Eligibility</h4>
                <p>
                  Refunds are available under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Before Access:</strong> The digital product has not been downloaded, accessed, or used</li>
                  <li><strong>Time Window:</strong> Request must be made within 24 hours of purchase</li>
                  <li><strong>Valid Reason:</strong> Must provide a legitimate reason from our approved list</li>
                  <li><strong>Original Payment Method:</strong> Refunds are processed to the original payment method only</li>
                </ul>

                <h4 className="text-lg font-medium">3.2.2 Automatic Access Tracking</h4>
                <p>
                  Our system automatically tracks when digital products are downloaded or accessed to ensure fair application of this policy. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Download button clicks and file transfers</li>
                  <li>Online access and viewing of digital content</li>
                  <li>API calls and automated access attempts</li>
                  <li>Timestamp logging for all access events</li>
                </ul>

                <h4 className="text-lg font-medium">3.2.3 Refund Process</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Submit refund request through your account or contact support</li>
                  <li>Our system automatically verifies eligibility</li>
                  <li>Eligible requests are processed within 3-5 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Access to the digital product is permanently revoked</li>
                </ol>

                <h4 className="text-lg font-medium">3.2.4 Exceptions and Special Cases</h4>
                <p>
                  Limited exceptions may be made for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Technical issues preventing download within 24 hours</li>
                  <li>Significant product misrepresentation</li>
                  <li>Duplicate purchases (automatic)</li>
                  <li>Payment processing errors</li>
                </ul>

                <h4 className="text-lg font-medium">3.2.5 Preview and Demo Content</h4>
                <p>
                  To help you make informed purchase decisions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Product previews are available and do not affect refund eligibility</li>
                  <li>Detailed product descriptions and specifications are provided</li>
                  <li>Customer reviews and ratings are displayed</li>
                  <li>Sample content may be available for certain products</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <p className="text-blue-900 text-sm">
                    <strong>By completing a purchase, you acknowledge that:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-blue-800 text-sm mt-2">
                    <li>You have read and understand this refund policy</li>
                    <li>Refunds are only available before downloading or accessing products</li>
                    <li>Your access will be tracked automatically</li>
                    <li>You have reviewed available previews and product information</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3.3 Comprehensive Refund Policy
              </h2>
              <div className="my-6">
                <RefundPolicyNotice variant="full-policy" />
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">4.1 Account Creation</h3>
                <p>
                  You may create an account to track purchases and access
                  download history. You are responsible for maintaining the
                  confidentiality of your account credentials.
                </p>

                <h3 className="text-xl font-medium">4.2 Account Termination</h3>
                <p>
                  We reserve the right to terminate accounts that violate these
                  terms or engage in fraudulent activity.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Intellectual Property
              </h2>
              <p>
                All digital products sold on DigiNest.io are protected by
                copyright and other intellectual property laws. The original
                creators retain all rights not expressly granted in the license.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Privacy and Data
              </h2>
              <p>
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">
                  7.1 Service Availability
                </h3>
                <p>
                  While we strive for 99.9% uptime, we do not guarantee
                  uninterrupted access to our services. Scheduled maintenance
                  will be announced in advance.
                </p>

                <h3 className="text-xl font-medium">7.2 Content Accuracy</h3>
                <p>
                  We make every effort to ensure product descriptions and
                  previews are accurate, but we do not warrant the completeness
                  or accuracy of any information.
                </p>

                <h3 className="text-xl font-medium">
                  7.3 Limitation of Liability
                </h3>
                <p>
                  In no event shall DigiNest.io be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including but not limited to loss of profits or data.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance
                with the laws of the United States, without regard to its
                conflict of law principles.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-neutral-100 p-4 rounded-lg mt-4">
                <p>
                  <strong>Email:</strong> legal@diginest.io
                </p>
                <p>
                  <strong>Support:</strong> support@diginest.io
                </p>
                <p>
                  <strong>Address:</strong> DigiNest.io, Digital Commerce
                  Division
                </p>
              </div>
            </section>

            <div className="text-center mt-12 pt-8 border-t">
              <Link href="/" className="text-blue-600 hover:underline">
                ← Back to DigiNest.io
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
