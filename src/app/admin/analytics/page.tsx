import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { AdminProtection } from "@/components/AdminProtection";

export const metadata = {
  title: "Analytics Dashboard - DigiNest.io Admin",
  description: "Comprehensive business analytics and intelligence dashboard",
};

export default function AdminAnalyticsPage() {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnalyticsDashboard />
        </div>
      </div>
    </AdminProtection>
  );
}
