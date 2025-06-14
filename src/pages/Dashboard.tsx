
import DashboardCards from "@/components/DashboardCards";

export default function Dashboard() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8">Analytics Dashboard</h2>
      <DashboardCards />
      <div className="w-full min-h-[350px] rounded-lg border flex items-center justify-center text-xl text-muted-foreground bg-muted">
        <span>[Charts coming soon]</span>
      </div>
    </div>
  );
}
