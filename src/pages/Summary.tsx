import React, { useState, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import SummaryMatrix from "@/components/SummaryMatrix";
import SummaryTable from "./summary/SummaryTable";
import SummaryActions from "./summary/SummaryActions";
import MainPieChart from "./visualization/MainPieChart";
import MainBarChart from "./visualization/MainBarChart";
import MainLineChart from "./visualization/MainLineChart";
import { chartsDummy, trendDummy } from "./visualization/visualizationUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

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

  // For PDF button loading spinner if needed
  const [exporting, setExporting] = React.useState(false);

  // Refs for export elements
  const pieRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  // Ref for summary matrix
  const summaryMatrixRef = React.useRef<HTMLDivElement>(null);
  // Ref for summary table
  const summaryTableRef = React.useRef<HTMLDivElement>(null);

  // Helper to format month name
  const getMonthName = (numStr: string) => {
    const num = Number(numStr);
    const date = new Date(2000, num - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Build common product/sales arrays with correct types
  const productToSummary = (arr: { name: string; value: number }[]) =>
    arr.map(p => ({ name: p.name, quantity: p.value, sales: 0 }));

  // Helper to ensure all report data have consistent { name, quantity, sales }
  const normalizeTableData = (
    arr: Array<{ name: string; value?: number; quantity?: number; sales: number }>
  ): { name: string; quantity: number; sales: number }[] =>
    arr.map(item => ({
      name: item.name,
      quantity: item.quantity ?? item.value ?? 0,
      sales: item.sales ?? 0,
    }));

  // Decide report table title and data
  let tableTitle = "";
  let tableData: { name: string; quantity: number; sales: number }[] = [];
  let subTitle = "";
  if (visibleReportType === "monthly") {
    tableTitle = `Sales & Quantity Summary - ${getMonthName(month)} ${year}`;
    // Use normalizeTableData to make sure types align
    tableData = normalizeTableData(dummyMonthlyReport);
    subTitle = `Month/Year: ${getMonthName(month)} ${year}`;
  } else if (visibleReportType === "annual") {
    tableTitle = `Sales & Quantity Summary - ${annualYear}`;
    tableData = normalizeTableData(dummyAnnualReport);
    subTitle = `Year: ${annualYear}`;
  }

  // Today's date in "MMMM dd, yyyy" format
  const getTodayDisplay = () => {
    return new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };

  // Renders a section (either table, matrix or chart) to the pdf
  const renderAndAdd = async (
    doc: any,
    element: HTMLDivElement | null,
    title: string,
    maxW: number,
    maxH: number,
    y: number,
    opts: {center?: boolean} = {}
  ) => {
    if (!element) return y;
    const canvas = await html2canvas(element, {
      backgroundColor: "#fff", // better contrast for export (was #18181b)
      scale: 2,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    // scale to fit maxW, maxH, preserving aspect
    let scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
    imgWidth = imgWidth * scale;
    imgHeight = imgHeight * scale;

    doc.setFontSize(13);
    doc.setTextColor("#1566B8");
    const pageWidth = doc.internal.pageSize.getWidth();
    if (opts.center) {
      doc.text(title, pageWidth / 2, y, {align: "center"});
    } else {
      doc.text(title, 55, y);
    }
    y += 16;
    doc.addImage(imgData, "PNG", opts.center ? (pageWidth - imgWidth) / 2 : 55, y, imgWidth, imgHeight, undefined, "FAST");
    y += imgHeight + 12;
    return y;
  };

  // NEW: PDF export from top section, includes all requested sections
  const handleDownloadPdf = async () => {
    if (visibleReportType === "none") return;
    setExporting(true);
    try {
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4"
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 40;

      // Title and selected period
      doc.setFontSize(18);
      doc.setTextColor("#1566B8");
      doc.text(tableTitle, pageWidth / 2, y, { align: "center" });

      y += 26;
      doc.setFontSize(11);
      doc.setTextColor("#222");
      doc.text(getTodayDisplay(), pageWidth / 2, y, { align: "center" });

      y += 18;
      doc.setFontSize(13);
      doc.text(subTitle, pageWidth / 2, y, { align: "center" });

      y += 24;

      // Export Matrix (Top 5/Bottom 5)
      if (summaryMatrixRef.current) {
        y = await renderAndAdd(doc, summaryMatrixRef.current, "Top 5 & Bottom 5 Products", pageWidth-80, 220, y, {center:true});
      }

      // Summary Table (well formatted)
      if (summaryTableRef.current) {
        y = await renderAndAdd(doc, summaryTableRef.current, "Summary Table", pageWidth-80, 200, y, {center:true});
      }

      // The main visualizations, one per page for best clarity
      // Pie
      if (pieRef.current) {
        doc.addPage();
        let vizY = 60;
        vizY = await renderAndAdd(doc, pieRef.current, "Pie: Product Categories (Top 5 & Bottom 5)", 400, 230, vizY, {center: true});
      }
      // Bar
      if (barRef.current) {
        doc.addPage();
        let vizY = 60;
        vizY = await renderAndAdd(doc, barRef.current, "Histogram: Quantity per Product (Top 5 & Bottom 5)", 400, 230, vizY, {center: true});
      }
      // Line
      if (lineRef.current) {
        doc.addPage();
        let vizY = 60;
        vizY = await renderAndAdd(doc, lineRef.current, "Line: Annual Trend per Product (Top 5 & Bottom 5)", 670, 280, vizY, {center: true});
      }

      doc.save(
        visibleReportType === "monthly"
          ? `Summary_${month}-${year}.pdf`
          : `Summary_${annualYear}.pdf`
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      <div className="relative z-10 bg-black/70 shadow rounded-xl px-4 py-8 max-w-3xl w-full animate-fade-in border border-cosmic-blue mx-3">
        <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-7 tracking-wider uppercase font-sans">
          Sales & Quantity Summary
        </h2>
        {/* Actions bar */}
        <SummaryActions
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          annualYear={annualYear}
          setAnnualYear={setAnnualYear}
          minYear={minYear}
          maxYear={maxYear}
          onMonthly={() => setVisibleReportType("monthly")}
          onAnnual={() => setVisibleReportType("annual")}
          exporting={exporting}
          onDownload={handleDownloadPdf}
          visibleReportType={visibleReportType}
        />

        <div ref={summaryMatrixRef}>
          <SummaryMatrix
            topQuantity={topQuantity}
            bottomQuantity={bottomQuantity}
            topSales={topSales}
            bottomSales={bottomSales}
          />
        </div>
        {visibleReportType !== "none" && (
          <div className="mt-8">
            <SummaryTable
              tableTitle={tableTitle}
              tableData={tableData}
              summaryTableRef={summaryTableRef}
            />
          </div>
        )}
        {/* Hidden Visual Chart Refs for PDF export */}
        <div style={{ display: "none" }}>
          <div ref={pieRef}>
            <MainPieChart data={[...topQuantity, ...bottomQuantity].map(item => ({
              name: item.name, quantity: item.value, sales: 0, category: "" }))} mode={"quantity"} />
          </div>
          <div ref={barRef}>
            <MainBarChart data={[...topQuantity, ...bottomQuantity].map(item => ({
              name: item.name, quantity: item.value, sales: 0, category: "" }))} mode={"quantity"} />
          </div>
          <div ref={lineRef}>
            <MainLineChart
              products={[...topQuantity, ...bottomQuantity].map(item => ({
                name: item.name, quantity: item.value, sales: 0, category: "" }))}
              mode="quantity"
              trendData={trendDummy([...topQuantity, ...bottomQuantity].map(p => p.name))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
