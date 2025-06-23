
import StarBackground from "@/components/StarBackground";
import AccessLoginForm from "@/components/AccessLoginForm";
import { useSessionAccess } from "@/hooks/useSessionAccess";
import { useNavigate } from "react-router-dom";
import { useSessionRegion } from "@/hooks/useSessionRegion";

export default function Home() {
  const { setLevel } = useSessionAccess();
  const { setRegion } = useSessionRegion();
  const navigate = useNavigate();

  function handleLogin(accessLevel: "L1" | "L2" | "L3") {
    setLevel(accessLevel);
    navigate("/month");
  }

  // On logout, clear region and access
  // (No header here, so region clear is handled on Logout in AccessHeader)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      <div className="relative z-10 flex flex-col items-center bg-black/70 rounded-xl shadow-xl px-8 py-12 backdrop-blur w-full max-w-md mx-auto border border-cosmic-blue animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-cosmic-blue text-center">
          Stock Tracking and Replenishment System
        </h1>
        <div className="uppercase mb-2 tracking-widest text-cosmic-gold font-semibold text-base opacity-85">
          STARS
        </div>
        <p className="text-lg text-slate-200 mb-8 text-center">
          Moitor. Track. Replenish. Inventory Management made Intelligent. <br />
          <span className="opacity-60 text-base">
            What You’ll Love About This System :
📊 Automated Stock SummariesF
⚠️ Smart Replenishment Alerts
🧠 Intelligent Threshold Detection
📈 Visual Inventory Insights
🔄 Effortless Stock Carryover
🔍 Instant Product Search & Month Filtering
🔐 Secure, Organized Storage

          </span>
        </p>
        <AccessLoginForm onSuccess={handleLogin} />
      </div>
    </div>
  );
}
