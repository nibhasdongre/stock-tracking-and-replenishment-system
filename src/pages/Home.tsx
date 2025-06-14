
import StarBackground from "@/components/StarBackground";
import VisualBackground from "@/components/VisualBackground";
import LoginButton from "@/components/LoginButton";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handleLogin() {
    // Simulated authentication: redirect to Page 2
    navigate("/month");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      {/* VisualBackground can add extra subtle space effect on top of the stars if desired, or comment out for simplicity */}
      {/* <VisualBackground /> */}
      <div className="relative z-10 flex flex-col items-center bg-black/70 rounded-xl shadow-xl px-8 py-12 backdrop-blur w-full max-w-md mx-auto border border-cosmic-blue animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-cosmic-blue text-center">
          Stock Replenishment & Tracking System
        </h1>
        <div className="uppercase mb-2 tracking-widest text-cosmic-gold font-semibold text-base opacity-85">
          STARS
        </div>
        <p className="text-lg text-slate-200 mb-8 text-center">
          Monitor, replenish, and track your inventory efficiently.<br />
          <span className="opacity-60 text-base">
            The modern solution for stock management with monthly analysis, edits, and more.
          </span>
        </p>
        <LoginButton onLogin={handleLogin} />
      </div>
    </div>
  );
}
