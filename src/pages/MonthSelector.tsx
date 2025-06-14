
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StarBackground from "@/components/StarBackground";
import { Rocket, Star } from "lucide-react";

export default function MonthSelector() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [mm, setMm] = useState(() => String(now.getMonth() + 1).padStart(2, "0"));
  const [yyyy, setYyyy] = useState(() => String(currentYear));
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  // Allowed range for year
  const minYear = 2010;
  const maxYear = currentYear;

  // Simple validators
  const monthNum = Number(mm);
  const yearNum = Number(yyyy);
  const isMonthValid = mm.length === 2 && monthNum >= 1 && monthNum <= 12;
  const isYearValid = yyyy.length === 4 && yearNum >= minYear && yearNum <= maxYear;
  const validInput = isMonthValid && isYearValid;

  function handleChooseMonth() {
    if (validInput) {
      // Create date string as yyyy-MM for consistency
      const formatted = `${yyyy}-${mm}`;
      navigate(`/current?month=${encodeURIComponent(formatted)}`);
    } else {
      setTouched(true);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-3 overflow-hidden bg-gradient-to-br from-night-1 via-night-2 to-space-5">
      <StarBackground />
      <div className="relative z-10 flex flex-col items-center bg-black/70 bg-blur-lg rounded-xl shadow-2xl px-6 py-10 backdrop-blur-md max-w-md w-full border border-white/10">
        <span className="mb-2 flex items-center gap-2 text-center mx-auto text-cosmic-gold">
          <Rocket size={26} className="mr-1" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase font-sans inline-block" style={{letterSpacing:"0.12em"}}>
            Stock Replenishment & Tracking System
          </h2>
          <Star className="ml-2" size={19} />
        </span>
        <div className="uppercase mb-4 tracking-widest text-cosmic-gold font-semibold text-sm opacity-85">
          <span>STARS</span>
        </div>
        <div className="mb-3 mt-2 text-cosmic-blue text-lg font-light text-center">
          Please select a month and year <br/>
          <span className="opacity-60 text-sm">Enter as MM / YYYY</span>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="block mb-1 text-sm font-medium text-slate-200">Enter Month & Year:</label>
          <div className="flex items-center gap-2 justify-center">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={mm}
              onChange={e => setMm(e.target.value.replace(/\D/g, ""))}
              placeholder="MM"
              className="w-14 text-center font-mono text-lg bg-white/10 text-slate-50 border-cosmic-blue focus:ring-cosmic-gold"
              aria-label="Month"
              onBlur={() => setTouched(true)}
            />
            <span className="text-lg font-semibold text-slate-400">/</span>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={yyyy}
              onChange={e => setYyyy(e.target.value.replace(/\D/g, ""))}
              placeholder="YYYY"
              className="w-20 text-center font-mono text-lg bg-white/10 text-slate-50 border-cosmic-blue focus:ring-cosmic-gold"
              aria-label="Year"
              onBlur={() => setTouched(true)}
            />
          </div>
          {touched && (!isMonthValid || !isYearValid) && (
            <p className="text-sm text-destructive mt-1 transition-colors text-center">
              Please enter a valid month (01–12) and year ({minYear}–{maxYear}).
            </p>
          )}
          <Button
            className="mt-4 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black text-base font-semibold rounded shadow"
            disabled={!validInput}
            onClick={handleChooseMonth}
          >
            Choose Month
          </Button>
          <div className="flex justify-between gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/current")}
              className="w-1/2 text-cosmic-blue"
            >
              View Current Month
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/summary")}
              className="w-1/2 border-cosmic-gold text-cosmic-gold"
            >
              Summarize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
