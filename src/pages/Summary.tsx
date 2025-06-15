import React, { useState, useEffect } from "react";
import StarBackground from "@/components/StarBackground";
import SummaryMatrix from "@/components/SummaryMatrix";
import SummaryTable from "./summary/SummaryTable";
import SummaryActions from "./summary/SummaryActions";
import MainPieChart from "./visualization/MainPieChart";
import MainBarChart from "./visualization/MainBarChart";
import MainLineChart from "./visualization/MainLineChart";
import { trendDummy } from "./visualization/visualizationUtils";
import { renderAndAdd, getTodayDisplay } from "./summary/pdfExportHelpers";
import jsPDF from "jspdf";
import AccessHeader from "@/components/AccessHeader";
import InvalidRequestDialog from "@/components/InvalidRequestDialog";
import { useSessionAccess } from "@/hooks/useSessionAccess";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import autoTable from "jspdf-autotable";
import { useSummaryPdfExport } from "./summary/hooks/useSummaryPdfExport";
import CompactTopBottomTable from "./summary/components/CompactTopBottomTable";

export default function Summary() {
  const now = new Date();
  const [month, setMonth] = useState(() => String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(() => String(now.getFullYear()));
  const [annualYear, setAnnualYear] = useState(() => String(now.getFullYear()));
  const [visibleReportType, setVisibleReportType] = useState<"none" | "monthly" | "annual">("none");
  const minYear = 2010;
  const maxYear = now.getFullYear();

  // New: Use query params to extract month/year as selected on MonthSelector
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedMonth = queryParams.get("month");
  const selectedYear = queryParams.get("year");

  // If month/year was passed from Month page, prefer that for PDF title
  let pdfMonth = month;
  let pdfYear = year;
  if (selectedMonth && /^(\d{1,2})$|^(\d{2})$/.test(selectedMonth)) {
    pdfMonth = selectedMonth.padStart(2, "0");
  }
  if (selectedYear && /^\d{4}$/.test(selectedYear)) {
    pdfYear = selectedYear;
  }
  // Fallback to annual report selection if visible
  if (visibleReportType === "annual") {
    pdfMonth = "";
    pdfYear = annualYear;
  }

  // Dummy data (same as before)
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

  // Helper to format month name
  const getMonthName = (numStr: string) => {
    const num = Number(numStr);
    const date = new Date(2000, num - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Compose PDF title and subtitle
  let pdfTitle = "Sales & Quantity Summary";
  let pdfSubTitle = "";
  if (pdfMonth && pdfYear) {
    pdfTitle = `${getMonthName(pdfMonth)} ${pdfYear} - Sales & Quantity Summary`;
    pdfSubTitle = `Month/Year: ${getMonthName(pdfMonth)} ${pdfYear}`;
  } else if (pdfYear) {
    pdfTitle = `${pdfYear} - Sales & Quantity Summary`;
    pdfSubTitle = `Year: ${pdfYear}`;
  } else {
    // should never get here but fallback
    pdfTitle = "Sales & Quantity Summary";
    pdfSubTitle = getTodayDisplay();
  }

  // Prepare table data
  const normalizeTableData = (arr: Array<{ name: string; value?: number; quantity?: number; sales: number }>) =>
    arr.map(item => ({
      name: item.name, quantity: item.quantity ?? item.value ?? 0, sales: item.sales ?? 0,
    }));

  let summaryTableData: { name: string; quantity: number; sales: number }[] = [];
  if (visibleReportType === "monthly") {
    summaryTableData = normalizeTableData(dummyMonthlyReport);
  } else if (visibleReportType === "annual") {
    summaryTableData = normalizeTableData(dummyAnnualReport);
  }

  // Hidden refs for export
  const summaryMatrixRef = React.useRef<HTMLDivElement>(null);
  const summaryTableRef = React.useRef<HTMLDivElement>(null);

  // Add extra refs for visualizations (by sales/by quantity, all chart types)
  const pieQuantityRef = React.useRef<HTMLDivElement>(null);
  const pieSalesRef = React.useRef<HTMLDivElement>(null);
  const barQuantityRef = React.useRef<HTMLDivElement>(null);
  const barSalesRef = React.useRef<HTMLDivElement>(null);
  const lineQuantityRef = React.useRef<HTMLDivElement>(null);
  const lineSalesRef = React.useRef<HTMLDivElement>(null);

  // Helper for offscreen export containers
  const [exportAreaVisible, setExportAreaVisible] = React.useState(false);

  // --- removed old CompactTopBottomTable and handleDownloadPdf from here ---
  const { exporting, setExporting, handleDownloadPdf } = useSummaryPdfExport();

  // Compose PDF export callback (just curried for easy use)
  const handlePdfExport = () =>
    handleDownloadPdf({
      visibleReportType,
      pdfTitle,
      pdfSubTitle,
      topQuantity,
      bottomQuantity,
      topSales,
      bottomSales,
      summaryTableData,
      pdfMonth,
      pdfYear,
      setExporting,
    });

  // Access control
  const { accessLevel, setLevel } = useSessionAccess();
  const [showInvalid, setShowInvalid] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (accessLevel !== "L3") setShowInvalid(true);
  }, [accessLevel]);

  function handleInvalidClose(open: boolean) {
    setShowInvalid(open);
    if (!open) navigate("/");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      <AccessHeader />
      <InvalidRequestDialog open={showInvalid} onOpenChange={handleInvalidClose} />
      {!showInvalid && (
        <div className="relative z-10 bg-black/70 shadow rounded-xl px-4 py-8 max-w-3xl w-full animate-fade-in border border-cosmic-blue mx-3">
          <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-7 tracking-wider uppercase font-sans">
            Sales & Quantity Summary
          </h2>
          <SummaryActions
            month={month} setMonth={setMonth}
            year={year} setYear={setYear}
            annualYear={annualYear} setAnnualYear={setAnnualYear}
            minYear={minYear} maxYear={maxYear}
            onMonthly={() => setVisibleReportType("monthly")}
            onAnnual={() => setVisibleReportType("annual")}
            exporting={exporting}
            onDownload={handlePdfExport}
            visibleReportType={visibleReportType}
          />
          {/* ---- REVERT TO ORIGINAL UI FOR TOP/BOTTOM 5 ---- */}
          <SummaryMatrix
            topQuantity={topQuantity}
            bottomQuantity={bottomQuantity}
            topSales={topSales}
            bottomSales={bottomSales}
          />
          {/* ---- END ORIGINAL UI ---- */}
          {visibleReportType !== "none" && (
            <div className="mt-8" ref={summaryTableRef}>
              <SummaryTable
                tableTitle={
                  visibleReportType === "monthly"
                    ? `Sales & Quantity Summary - ${getMonthName(month)} ${year}`
                    : `Sales & Quantity Summary - ${annualYear}`
                }
                tableData={summaryTableData}
              />
            </div>
          )}

          {/* Hidden Export Offscreen Area for PDF */}
          {exportAreaVisible && (
            <div
              style={{
                position: 'fixed',
                top: '-999px',
                left: '-999px',
                width: '1400px',
                background: '#fff',
                zIndex: 99999,
                pointerEvents: 'none',
                opacity: 1
              }}
            >
              {/* Top/Bottom 5 compact tables (used for PDF rendering) */}
              <div>
                <CompactTopBottomTable
                  topQuantity={topQuantity}
                  bottomQuantity={bottomQuantity}
                  topSales={topSales}
                  bottomSales={bottomSales}
                />
              </div>
              {/* Summary Table (in larger area to avoid cropping) */}
              <div ref={summaryTableRef}>
                <SummaryTable
                  tableTitle={
                    visibleReportType === "monthly"
                      ? `Sales & Quantity Summary - ${getMonthName(month)} ${year}`
                      : `Sales & Quantity Summary - ${annualYear}`
                  }
                  tableData={summaryTableData}
                />
              </div>
              {/* Visualizations - By Quantity */}
              <div ref={pieQuantityRef} style={{padding: 24, background: "#fff"}}>
                <MainPieChart data={[...topQuantity, ...bottomQuantity].map(item => ({name: item.name, quantity: item.value, sales: 0, category: ""}))} mode="quantity" />
              </div>
              <div ref={barQuantityRef} style={{padding: 24, background: "#fff"}}>
                <MainBarChart data={[...topQuantity, ...bottomQuantity].map(item => ({name: item.name, quantity: item.value, sales: 0, category: ""}))} mode="quantity" />
              </div>
              <div ref={lineQuantityRef} style={{padding: 24, background: "#fff"}}>
                <MainLineChart
                  products={[...topQuantity, ...bottomQuantity].map(item => ({name: item.name, quantity: item.value, sales: 0, category: ""}))}
                  mode="quantity"
                  trendData={trendDummy([...topQuantity, ...bottomQuantity].map(p => p.name))}
                />
              </div>
              {/* Visualizations - By Sales */}
              <div ref={pieSalesRef} style={{padding: 24, background: "#fff"}}>
                <MainPieChart data={[...topSales, ...bottomSales].map(item => ({name: item.name, sales: item.value, quantity: 0, category: ""}))} mode="sales" />
              </div>
              <div ref={barSalesRef} style={{padding: 24, background: "#fff"}}>
                <MainBarChart data={[...topSales, ...bottomSales].map(item => ({name: item.name, sales: item.value, quantity: 0, category: ""}))} mode="sales" />
              </div>
              <div ref={lineSalesRef} style={{padding: 24, background: "#fff"}}>
                <MainLineChart
                  products={[...topSales, ...bottomSales].map(item => ({name: item.name, sales: item.value, quantity: 0, category: ""}))}
                  mode="sales"
                  trendData={trendDummy([...topSales, ...bottomSales].map(p => p.name))}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
