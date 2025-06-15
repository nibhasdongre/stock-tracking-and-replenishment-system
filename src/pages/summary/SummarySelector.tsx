
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
  // Remove useNavigate and Visualize button (no longer needed)
  return (
    <div
      className="
        flex flex-col gap-3 sm:gap-4 w-full mb-7 px-2
        sm:flex-row sm:flex-wrap sm:justify-between
        md:items-center md:gap-6
        "
    >
      <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-end">
        <div className="flex gap-2 items-end w-full sm:w-auto flex-wrap">
          <label className="block text-cosmic-gold font-semibold mb-1 text-xs uppercase whitespace-nowrap">Month/Year:</label>
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
            className="mt-2 sm:mt-0 sm:ml-3 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold whitespace-nowrap"
            size="sm"
            onClick={onMonthly}
          >
            <CalendarIcon className="mr-1 w-4" />
            Show report
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-end">
        <div className="flex gap-2 items-end w-full sm:w-auto flex-wrap">
          <label className="block text-cosmic-gold font-semibold mb-1 text-xs uppercase whitespace-nowrap">Annual report:</label>
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
            className="mt-2 sm:mt-0 sm:ml-3 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold whitespace-nowrap"
            size="sm"
            onClick={onAnnual}
          >
            <CalendarIcon className="mr-1 w-4" />
            View annual
          </Button>
        </div>
      </div>
      {/* Removed the bottom Visualize button */}
    </div>
  );
};

export default SummarySelector;

