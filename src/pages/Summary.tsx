import React, { useState, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import SummaryMatrix from "@/components/SummaryMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BarChartHorizontal, Download } from "lucide-react";
import jsPDF from "jspdf";

// Stub/mock data for demo
const topQuantity = [
  { name: "Product Alpha", value: 220 },
  { name: "Product Beta", value: 170 },
  { name: "Product Gamma", value: 156 },
  { name: "Product Delta", value: 132 },
  { name: "Product Zeta", value: 120 },
];
const bottomQuantity = [
  { name: "Product Lambda", value: 13 },
  { name: "Product Xi", value: 15 },
  { name: "Product Kappa", value: 22 },
  { name: "Product Pi", value: 35 },
  { name: "Product Sigma", value: 38 },
];
const topSales = [
  { name: "Product Beta", value: 12050 },
  { name: "Product Alpha", value: 11700 },
  { name: "Product Gamma", value: 10680 },
  { name: "Product Delta", value: 10290 },
  { name: "Product Zeta", value: 9850 },
];
const bottomSales = [
  { name: "Product Lambda", value: 1180 },
  { name: "Product Xi", value: 1295 },
  { name: "Product Kappa", value: 1630 },
  { name: "Product Pi", value: 1780 },
  { name: "Product Sigma", value: 1900 },
];

// Dummy report data
const dummyMonthlyReport = [
  { name: "Product Alpha", quantity: 45, sales: 1200 },
  { name: "Product Beta", quantity: 39, sales: 1050 },
  { name: "Product Gamma", quantity: 29, sales: 850 },
  { name: "Product Delta", quantity: 26, sales: 720 },
  { name: "Product Zeta", quantity: 24, sales: 690 },
];

const dummyAnnualReport = [
  { name: "Product Beta", quantity: 401, sales: 12050 },
  { name: "Product Alpha", quantity: 389, sales: 11700 },
  { name: "Product Gamma", quantity: 318, sales: 10680 },
  { name: "Product Delta", quantity: 283, sales: 10290 },
  { name: "Product Zeta", quantity: 269, sales: 9850 },
];

export default function Summary() {
  const navigate = useNavigate();
  const now = new Date();
  // Month/year form
  const [month, setMonth] = useState(() => String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(() => String(now.getFullYear()));
  const [annualYear, setAnnualYear] = useState(() => String(now.getFullYear()));
  const [visibleReportType, setVisibleReportType] = useState<"none" | "monthly" | "annual">("none");
  const minYear = 2010;
  const maxYear = now.getFullYear();

  const reportTableRef = useRef<HTMLDivElement>(null);

  // Simple PDF export for visible table (uses jsPDF html method)
  const handleDownloadPdf = () => {
    if (reportTableRef.current) {
      const doc = new jsPDF();
      doc.html(reportTableRef.current, {
        callback: function (doc) {
          doc.save(
            visibleReportType === "monthly"
              ? `monthly-report-${month}-${year}.pdf`
              : `annual-report-${annualYear}.pdf`
          );
        },
        x: 10,
        y: 10,
        width: 180
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      <div className="relative z-10 bg-black/70 shadow rounded-xl px-4 py-8 max-w-3xl w-full animate-fade-in border border-cosmic-blue mx-3">
        <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-7 tracking-wider uppercase font-sans">
          Sales & Quantity Summary
        </h2>
        {/* Matrix */}
        <SummaryMatrix
          topQuantity={topQuantity}
          bottomQuantity={bottomQuantity}
          topSales={topSales}
          bottomSales={bottomSales}
        />
        {/* Date & actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-2">
          {/* Month Picker */}
          <div className="flex gap-2 items-end">
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
              className="ml-3 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold"
              size="sm"
              onClick={() => setVisibleReportType("monthly")}
            >
              <CalendarIcon className="mr-1 w-4" />
              Show report for that month
            </Button>
          </div>
        </div>
        {/* Annual report action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-2">
          <div className="flex items-end gap-2">
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
              className="ml-3 bg-cosmic-blue text-cosmic-gold hover:bg-cosmic-gold hover:text-black rounded shadow text-base font-semibold"
              size="sm"
              onClick={() => setVisibleReportType("annual")}
            >
              <CalendarIcon className="mr-1 w-4" />
              View annual report
            </Button>
          </div>
          <Button
            variant="outline"
            className="border-cosmic-gold text-cosmic-gold font-semibold px-5 ml-4"
            onClick={() => navigate("/visualization")}
            size="sm"
          >
            <BarChartHorizontal className="w-4 mr-1" />
            Visualize
          </Button>
        </div>

        {/* Report table (shows after clicking report buttons) */}
        {visibleReportType !== "none" && (
          <div className="mt-8">
            <div ref={reportTableRef}>
              <h3 className="text-center text-lg font-bold text-cosmic-gold mb-2">
                {visibleReportType === "monthly"
                  ? `Monthly Report for ${month}-${year}`
                  : `Annual Report for ${annualYear}`}
              </h3>
              <table className="w-full border text-slate-100 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-cosmic-blue text-black">
                    <th className="p-2">Product</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {(visibleReportType === "monthly"
                    ? dummyMonthlyReport
                    : dummyAnnualReport
                  ).map((row, i) => (
                    <tr
                      key={i}
                      className="bg-black/70 border-b last:border-0"
                    >
                      <td className="p-2">{row.name}</td>
                      <td className="p-2 text-center">{row.quantity}</td>
                      <td className="p-2 text-center">{row.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              className="mt-5 flex items-center bg-cosmic-gold text-black font-semibold hover:bg-cosmic-blue hover:text-cosmic-gold"
              onClick={handleDownloadPdf}
              size="sm"
            >
              <Download className="w-4 mr-2" />
              Download as PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
