import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

                <h3 className="text-xl font-medium">3.2 Refund Policy</h3>
                <p>
                  Due to the digital nature of our products, all sales are
                  final. However, we may provide refunds in cases of:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Technical issues preventing download</li>
                  <li>Significant product misrepresentation</li>
                  <li>Duplicate purchases</li>
                </ul>
                <p>
                  Refund requests must be submitted within 7 days of purchase to
                  support@diginest.io.
                </p>
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
