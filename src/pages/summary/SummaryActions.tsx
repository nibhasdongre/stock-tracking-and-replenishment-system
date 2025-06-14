
import React from "react";
import { Button } from "@/components/ui/button";
import SummarySelector from "./SummarySelector";
import { BarChartHorizontal, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SummaryActionsProps {
  month: string;
  setMonth: (m: string) => void;
  year: string;
  setYear: (y: string) => void;
  annualYear: string;
  setAnnualYear: (y: string) => void;
  minYear: number;
  maxYear: number;
  onMonthly: () => void;
  onAnnual: () => void;
  exporting: boolean;
  onDownload: () => void;
  visibleReportType: "none" | "monthly" | "annual";
}

export default function SummaryActions({
  month,
  setMonth,
  year,
  setYear,
  annualYear,
  setAnnualYear,
  minYear,
  maxYear,
  onMonthly,
  onAnnual,
  exporting,
  onDownload,
  visibleReportType
}: SummaryActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div className="flex-1">
        <SummarySelector
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          annualYear={annualYear}
          setAnnualYear={setAnnualYear}
          minYear={minYear}
          maxYear={maxYear}
          onMonthly={onMonthly}
          onAnnual={onAnnual}
        />
      </div>
      {/* Actions */}
      <div className="flex flex-row gap-2 mt-1 sm:mt-0 justify-end">
        <Button
          variant="outline"
          className="border-cosmic-gold text-cosmic-gold font-semibold px-5 whitespace-nowrap"
          onClick={() => navigate("/visualization?month=" + month + "&year=" + year)}
          size="sm"
        >
          <BarChartHorizontal className="w-4 mr-1" />
          Visualize
        </Button>
        {visibleReportType !== "none" && (
          <Button
            className="bg-cosmic-gold text-black font-semibold hover:bg-cosmic-blue hover:text-cosmic-gold whitespace-nowrap flex items-center"
            onClick={onDownload}
            disabled={exporting}
            size="sm"
            type="button"
          >
            <Download className="w-4 mr-2" />
            {exporting ? "Exporting..." : "Download as PDF"}
          </Button>
        )}
      </div>
    </div>
  );
}
