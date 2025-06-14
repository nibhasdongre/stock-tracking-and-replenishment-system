
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BarChartHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SummarySelectorProps = {
  month: string;
  setMonth: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  annualYear: string;
  setAnnualYear: (v: string) => void;
  minYear: number;
  maxYear: number;
  onMonthly: () => void;
  onAnnual: () => void;
};

const SummarySelector: React.FC<SummarySelectorProps> = ({
  month, setMonth, year, setYear, annualYear, setAnnualYear, minYear, maxYear, onMonthly, onAnnual
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center md:gap-4 mb-7 w-full px-2">
      <div className="flex-1 flex flex-col gap-2 md:flex-row md:items-end">
        <div className="flex gap-2 items-end w-full md:w-auto">
          <label className="block text-cosmic-gold font-semibold mb-1 text-xs uppercase">Month/Year:</label>
          <Input
            className="w-14 text-center font-mono text-sm bg-white/10 text-slate-50 border-cosmic-blue focus:ring-cosmic-gold"
            type="text"
            maxLength={2}
            inputMode="numeric"
            placeholder="MM"
            value={month}
            onChange={e => setMonth(e.target.value.replace(/\D/g, ""))}
          />
          <span className="text-cosmic-gold font-bold mx-1 mb-1">/</span>
          <Input
            className="w-20 text-center font-mono text-sm bg-white/10 text-slate-50 border-cosmic-blue focus:ring-cosmic-gold"
            type="text"
            maxLength={4}
            inputMode="numeric"
            placeholder="YYYY"
            value={year}
            onChange={e => setYear(e.target.value.replace(/\D/g, ""))}
          />
          <Button
            className="ml-0 md:ml-3 mt-2 md:mt-0 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold"
            size="sm"
            onClick={onMonthly}
          >
            <CalendarIcon className="mr-1 w-4" />
            Show report
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 md:flex-row md:items-end">
        <div className="flex items-end gap-2 w-full md:w-auto">
          <label className="block text-cosmic-gold font-semibold mb-1 text-xs uppercase">Annual report:</label>
          <Input
            className="w-20 text-center font-mono text-sm bg-white/10 text-slate-50 border-cosmic-blue focus:ring-cosmic-gold"
            type="text"
            maxLength={4}
            inputMode="numeric"
            placeholder="YYYY"
            value={annualYear}
            onChange={e => setAnnualYear(e.target.value.replace(/\D/g, ""))}
            min={minYear}
            max={maxYear}
          />
          <Button
            className="ml-0 md:ml-3 mt-2 md:mt-0 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold"
            size="sm"
            onClick={onAnnual}
          >
            <CalendarIcon className="mr-1 w-4" />
            View annual
          </Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center mt-3 md:mt-0 md:justify-end">
        <Button
          variant="outline"
          className="border-cosmic-gold text-cosmic-gold font-semibold px-5"
          onClick={() => navigate("/visualization")}
          size="sm"
        >
          <BarChartHorizontal className="w-4 mr-1" />
          Visualize
        </Button>
      </div>
    </div>
  );
};

export default SummarySelector;
