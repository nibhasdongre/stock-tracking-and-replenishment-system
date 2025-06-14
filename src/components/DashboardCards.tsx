
import { ChartBar, ChartPie } from "lucide-react";

// Placeholder card visualizations
export default function DashboardCards() {
  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-3 mt-8 mb-8">
      <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-100 via-white to-gray-50 flex flex-col items-start shadow-sm">
        <span className="font-bold text-lg mb-2 flex items-center gap-2">
          <ChartBar size={22} className="text-blue-600" />
          Stock Alerts
        </span>
        <span className="mt-2 text-3xl font-semibold text-blue-900">2 low stock</span>
        <span className="text-sm text-muted-foreground">Restock needed soon</span>
      </div>
      <div className="p-6 rounded-lg border bg-gradient-to-br from-green-100 via-white to-gray-50 flex flex-col items-start shadow-sm">
        <span className="font-bold text-lg mb-2 flex items-center gap-2">
          <ChartPie size={22} className="text-green-700" />
          Category Breakdown
        </span>
        <span className="mt-2 text-3xl font-semibold text-green-900">Hardware: 60%</span>
        <span className="text-sm text-muted-foreground">Supplies: 40%</span>
      </div>
      <div className="p-6 rounded-lg border bg-gradient-to-br from-purple-100 via-white to-gray-50 flex flex-col items-start shadow-sm">
        <span className="font-bold text-lg mb-2 flex items-center gap-2">
          <ChartBar size={22} className="text-purple-600" />
          Total SKUs
        </span>
        <span className="mt-2 text-3xl font-semibold text-purple-900">12</span>
        <span className="text-sm text-muted-foreground">Tracked products</span>
      </div>
    </div>
  );
}
