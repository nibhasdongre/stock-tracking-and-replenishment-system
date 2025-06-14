
import StarBackground from "@/components/StarBackground";
import DashboardCards from "@/components/DashboardCards";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8 text-cosmic-blue">Analytics Dashboard</h2>
        <DashboardCards />
        <div className="w-full min-h-[350px] rounded-lg border flex items-center justify-center text-xl text-muted-foreground bg-black/70 border-cosmic-blue">
          <span>[Charts coming soon]</span>
        </div>
      </div>
    </div>
  );
}
