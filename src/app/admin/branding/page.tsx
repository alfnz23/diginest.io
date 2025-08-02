import BrandingCustomizer from "@/components/BrandingCustomizer";
import { AdminProtection } from "@/components/AdminProtection";

export default function BrandingPage() {
  return (
    <AdminProtection>
      <BrandingCustomizer />
    </AdminProtection>
  );
}
