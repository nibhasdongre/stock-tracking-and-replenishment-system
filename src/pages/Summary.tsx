import React, { useState, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import SummaryMatrix from "@/components/SummaryMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BarChartHorizontal, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import MainPieChart from "./visualization/MainPieChart";
import MainBarChart from "./visualization/MainBarChart";
import MainLineChart from "./visualization/MainLineChart";
import { chartsDummy, trendDummy } from "./visualization/visualizationUtils";
import SummaryTable from "./summary/SummaryTable";
import SummarySelector from "./summary/SummarySelector";

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
  const [exporting, setExporting] = useState(false);

  // Refs for export elements
  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  // Ref for summary matrix
  const summaryMatrixRef = useRef<HTMLDivElement>(null);
  // Ref for summary table
  const summaryTableRef = useRef<HTMLDivElement>(null);

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

  // Improved helper for image rendering 
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
    // Use higher scale for better quality, set background white, and avoid cropping
    const canvas = await html2canvas(element, {
      backgroundColor: "#18181b",
      scale: 2,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    // Scale to fit maxW, maxH, preserving aspect
    let scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
    imgWidth = imgWidth * scale;
    imgHeight = imgHeight * scale;

    doc.setFontSize(13);
    doc.setTextColor("#1566B8");
    if (opts.center) {
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(title, pageWidth / 2, y, {align: "center"});
    } else {
      doc.text(title, 55, y);
    }
    y += 16;

    doc.addImage(imgData, "PNG", opts.center ? (doc.internal.pageSize.getWidth() - imgWidth)/2 : 55, y, imgWidth, imgHeight, undefined, "FAST");
    y += imgHeight + 12;
    return y;
  };

  // NEW: PDF export from top section
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

      // Title
      doc.setFontSize(18);
      doc.setTextColor("#1566B8");
      doc.text(tableTitle, pageWidth / 2, y, { align: "center" });

      // Date & Period
      y += 20;
      doc.setFontSize(11);
      doc.setTextColor("#222");
      doc.text(getTodayDisplay(), pageWidth / 2, y, { align: "center" });

      y += 18;
      doc.setFontSize(12);
      doc.text(subTitle, pageWidth / 2, y, { align: "center" });

      y += 18;

      // Top 5/Bottom 5 Matrix image
      if (summaryMatrixRef.current) {
        y = await renderAndAdd(doc, summaryMatrixRef.current, "Top 5 & Bottom 5 Products", pageWidth-80, 220, y, {center:true});
      } else {
        // fallback: autoTable for matrix if not present (edge case)
        y += 8;
        autoTable(doc, {
          startY: y,
          head: [
            [
              { content: "Top 5 Products (Quantity)", styles: { halign: 'center', fillColor: "#d9e7fa", textColor: "#1566B8" } },
              { content: "Top 5 Products (Sales)", styles: { halign: 'center', fillColor: "#fff9cf", textColor: "#C7B042" } }
            ]
          ],
          body: Array.from({ length: 5 }).map((_, i) => [
            `${topQuantity[i]?.name ?? ""} ${topQuantity[i]?.value !== undefined ? " - " + topQuantity[i]?.value : ""}`,
            `${topSales[i]?.name ?? ""} ${topSales[i]?.value !== undefined ? " - " + topSales[i]?.value : ""}`,
          ]),
          theme: "grid",
          margin: { left: 55, right: 55 },
        });
        let nextY = (doc as any).lastAutoTable.finalY + 8;
        autoTable(doc, {
          startY: nextY,
          head: [
            [
              { content: "Bottom 5 Products (Quantity)", styles: { halign: 'center', fillColor: "#d9e7fa", textColor: "#1566B8" } },
              { content: "Bottom 5 Products (Sales)", styles: { halign: 'center', fillColor: "#fff9cf", textColor: "#C7B042" } }
            ]
          ],
          body: Array.from({ length: 5 }).map((_, i) => [
            `${bottomQuantity[i]?.name ?? ""} ${bottomQuantity[i]?.value !== undefined ? " - " + bottomQuantity[i]?.value : ""}`,
            `${bottomSales[i]?.name ?? ""} ${bottomSales[i]?.value !== undefined ? " - " + bottomSales[i]?.value : ""}`,
          ]),
          theme: "grid",
          margin: { left: 55, right: 55 },
        });
        y = (doc as any).lastAutoTable.finalY + 12;
      }

      // Add main summary table as image
      if (summaryTableRef.current) {
        y = await renderAndAdd(doc, summaryTableRef.current, "Summary Table", pageWidth-80, 200, y, {center:true});
      }

      // Visualizations (Pie, Bar, Line)
      y = await renderAndAdd(doc, pieRef.current, "Pie: Product Categories (Top 5 & Bottom 5)", 340, 220, y);
      y = await renderAndAdd(doc, barRef.current, "Histogram: Quantity per Product (Top 5 & Bottom 5)", 340, 220, y);
      y = await renderAndAdd(doc, lineRef.current, "Line: Annual Trend per Product (Top 5 & Bottom 5)", 700, 230, y);

      doc.save(
        visibleReportType === "monthly"
          ? `Sales_Quantity_Summary_${month}-${year}.pdf`
          : `Sales_Quantity_Summary_${annualYear}.pdf`
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
        {/* Selector at top - visualize & download buttons */}
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
              onMonthly={() => setVisibleReportType("monthly")}
              onAnnual={() => setVisibleReportType("annual")}
            />
          </div>
          <div className="flex flex-row gap-2 mt-1 sm:mt-0 justify-end">
            <Button
              variant="outline"
              className="border-cosmic-gold text-cosmic-gold font-semibold px-5 whitespace-nowrap"
              onClick={() => navigate("/visualization")}
              size="sm"
            >
              <BarChartHorizontal className="w-4 mr-1" />
              Visualize
            </Button>
            {visibleReportType !== "none" && (
              <Button
                className="bg-cosmic-gold text-black font-semibold hover:bg-cosmic-blue hover:text-cosmic-gold whitespace-nowrap flex items-center"
                onClick={handleDownloadPdf}
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
        {/* Top 5 / Bottom 5 Matrix */}
        <div ref={summaryMatrixRef}>
          <SummaryMatrix
            topQuantity={topQuantity}
            bottomQuantity={bottomQuantity}
            topSales={topSales}
            bottomSales={bottomSales}
          />
        </div>
        {/* Summary Table below */}
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
