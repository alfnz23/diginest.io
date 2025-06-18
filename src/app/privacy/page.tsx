import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - DigiNest.io",
  description: "Privacy Policy and data protection practices for DigiNest.io digital marketplace",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-neutral-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">1.1 Personal Information</h3>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address when creating an account</li>
                  <li>Payment information processed by our secure payment providers</li>
                  <li>Communication preferences and support inquiries</li>
                  <li>Optional profile information you choose to provide</li>
                </ul>

                <h3 className="text-xl font-medium">1.2 Automatically Collected Information</h3>
                <p>We automatically collect certain information when you use our service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage patterns and analytics data</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process purchases and deliver digital products</li>
                <li>Create and manage your account</li>
                <li>Send important updates about your orders and account</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and user experience</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Detect and prevent fraud or unauthorized access</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">3.1 Service Providers</h3>
                <p>We share information with trusted third-party service providers:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Payment Processors:</strong> Stripe and PayPal for secure payment processing</li>
                  <li><strong>Email Services:</strong> SendGrid or similar for transactional emails</li>
                  <li><strong>Analytics:</strong> Google Analytics for website usage insights</li>
                  <li><strong>Cloud Hosting:</strong> Netlify and Vercel for website hosting</li>
                </ul>

                <h3 className="text-xl font-medium">3.2 Legal Requirements</h3>
                <p>We may disclose information when required by law or to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with legal process or government requests</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or abuse of our services</li>
                  <li>Protect the rights and safety of our users</li>
                </ul>

                <h3 className="text-xl font-medium">3.3 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred
                  as part of that transaction. We will notify users of any such change in ownership.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <div className="space-y-4">
                <p>We implement appropriate security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by employees</li>
                  <li>Secure cloud infrastructure with enterprise-grade security</li>
                </ul>
                <p className="text-sm text-neutral-600 bg-neutral-100 p-3 rounded">
                  <strong>Note:</strong> While we use industry-standard security measures, no method of transmission
                  over the internet is 100% secure. We cannot guarantee absolute security of your information.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">5.1 Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>

                <h3 className="text-xl font-medium">5.2 Managing Cookies</h3>
                <p>
                  You can control cookie settings through your browser preferences. Note that disabling
                  certain cookies may affect site functionality.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">6.1 Account Information</h3>
                <p>You can access and update your account information at any time through your account settings.</p>

                <h3 className="text-xl font-medium">6.2 Email Communications</h3>
                <p>You can opt out of marketing emails by clicking the unsubscribe link or contacting support.</p>

                <h3 className="text-xl font-medium">6.3 Data Rights (GDPR)</h3>
                <p>If you're in the EU, you have additional rights including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to delete your data (subject to legal requirements)</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>We retain your information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations and resolve disputes</li>
                <li>Maintain purchase history for customer support</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
              <p>
                Account information is typically retained for 3 years after account closure,
                unless you request earlier deletion or we're required to retain it longer.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own.
                We ensure appropriate safeguards are in place for such transfers, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard contractual clauses approved by regulatory authorities</li>
                <li>Adequacy decisions for certain countries</li>
                <li>Certification under recognized frameworks</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If we become aware that we have
                collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the "Last updated" date.
                For significant changes, we may also send you an email notification.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-neutral-100 p-4 rounded-lg mt-4">
                <p><strong>Email:</strong> privacy@diginest.io</p>
                <p><strong>Support:</strong> support@diginest.io</p>
                <p><strong>Data Protection Officer:</strong> dpo@diginest.io</p>
                <p><strong>Address:</strong> DigiNest.io, Privacy Department</p>
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
