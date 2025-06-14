
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MonthSelector() {
  const now = new Date();
  const [mm, setMm] = useState(() => String(now.getMonth() + 1).padStart(2, "0"));
  const [yyyy, setYyyy] = useState(() => String(now.getFullYear()));
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  // Allowed range for year
  const minYear = 2010;
  const maxYear = 2050;

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-3">
      <h2 className="text-3xl font-bold mb-6">
        {format(now, "MMMM yyyy")}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={() => navigate("/current")}
          className="text-base"
        >
          View Current Month
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/summary")}
          className="text-base"
        >
          Summarize
        </Button>
        <div className="flex flex-col mt-4 gap-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Enter Month & Year:</label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={mm}
                onChange={e => setMm(e.target.value.replace(/\D/g, ""))}
                placeholder="MM"
                className="w-14"
                aria-label="Month"
                onBlur={() => setTouched(true)}
              />
              <span className="text-xl font-semibold">/</span>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={yyyy}
                onChange={e => setYyyy(e.target.value.replace(/\D/g, ""))}
                placeholder="YYYY"
                className="w-20"
                aria-label="Year"
                onBlur={() => setTouched(true)}
              />
            </div>
            {touched && (!isMonthValid || !isYearValid) && (
              <p className="text-sm text-destructive mt-1 transition-colors">
                Please enter a valid month (01–12) and year ({minYear}–{maxYear}).
              </p>
            )}
          </div>
          <Button
            className="mt-2 text-base"
            disabled={!validInput}
            onClick={handleChooseMonth}
          >
            Choose Month
          </Button>
        </div>
      </div>
    </div>
  );
}
