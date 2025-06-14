
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
      <VisualBackground />
      <div className="relative z-10 flex flex-col items-center bg-white/80 rounded-xl shadow-xl px-8 py-12 backdrop-blur w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Stock Replenishment & Tracking System</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Monitor, replenish, and track your inventory efficiently.<br />
          The modern solution for stock management with monthly analysis, edits, and more.
        </p>
        <LoginButton onLogin={handleLogin} />
      </div>
    </div>
  );
}
