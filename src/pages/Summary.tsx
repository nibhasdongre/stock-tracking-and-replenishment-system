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

  // Refs for visualization images
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

  // Decide report table title and data
  let tableTitle = "";
  let tableData: { name: string; quantity: number; sales: number }[] = [];
  let subTitle = "";
  if (visibleReportType === "monthly") {
    tableTitle = `Sales & Quantity Summary - ${getMonthName(month)} ${year}`;
    tableData = dummyMonthlyReport;
    subTitle = `Month/Year: ${getMonthName(month)} ${year}`;
  } else if (visibleReportType === "annual") {
    tableTitle = `Sales & Quantity Summary - ${annualYear}`;
    tableData = dummyAnnualReport;
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

  // PDF export: summary table, 5/5 "matrix", all 3 main visualizations in nice order.
  const handleDownloadPdf = async () => {
    if (visibleReportType === "none") return;

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

    // Add Top 5/Bottom 5 Matrix as image (clean, formatted)
    if (summaryMatrixRef.current) {
      y = await renderAndAdd(doc, summaryMatrixRef.current, "Top 5 & Bottom 5 Products", pageWidth-80, 220, y, {center:true});
    } else {
      // fallback: autoTable matrix
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
        fontSize: 10,
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
        fontSize: 10,
      });
      y = (doc as any).lastAutoTable.finalY + 12;
    }

    // Add main summary table as image
    if (summaryTableRef.current) {
      y = await renderAndAdd(doc, summaryTableRef.current, "Summary Table", pageWidth-80, 200, y, {center:true});
    }

    // Visualizations
    y = await renderAndAdd(doc, pieRef.current, "Pie: Product Categories (Top 5 & Bottom 5)", 340, 220, y);
    y = await renderAndAdd(doc, barRef.current, "Histogram: Quantity per Product (Top 5 & Bottom 5)", 340, 220, y);
    y = await renderAndAdd(doc, lineRef.current, "Line: Annual Trend per Product (Top 5 & Bottom 5)", 700, 230, y);

    doc.save(
      visibleReportType === "monthly"
        ? `Sales_Quantity_Summary_${month}-${year}.pdf`
        : `Sales_Quantity_Summary_${annualYear}.pdf`
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <StarBackground />
      <div className="relative z-10 bg-black/70 shadow rounded-xl px-4 py-8 max-w-3xl w-full animate-fade-in border border-cosmic-blue mx-3">
        <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-7 tracking-wider uppercase font-sans">
          Sales & Quantity Summary
        </h2>
        {/* Matrix */}
        <div ref={summaryMatrixRef}>
          <SummaryMatrix
            topQuantity={topQuantity}
            bottomQuantity={bottomQuantity}
            topSales={topSales}
            bottomSales={bottomSales}
          />
        </div>
        {/* Viz Chart REFS, hidden but with real charts */}
        <div style={{ display: "none" }}>
          <div ref={pieRef}>
            <MainPieChart data={[...topQuantity, ...bottomQuantity].map(item=>({name:item.name, quantity:item.value, sales:0, category:""}))} mode={"quantity"} />
          </div>
          <div ref={barRef}>
            <MainBarChart data={[...topQuantity, ...bottomQuantity].map(item=>({name:item.name, quantity:item.value, sales:0, category:""}))} mode={"quantity"} />
          </div>
          <div ref={lineRef}>
            <MainLineChart
              products={[...topQuantity, ...bottomQuantity].map(item=>({name:item.name, quantity:item.value, sales:0, category:""}))}
              mode="quantity"
              trendData={trendDummy([...topQuantity, ...bottomQuantity].map(p=>p.name))}
            />
          </div>
        </div>
        {/* Moved: Date & Annual Selection to top */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-7">
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
            {/* Visible summary table FOR IMAGE EXPORT */}
            <div ref={summaryTableRef}>
              <h3 className="text-center text-lg font-bold text-cosmic-gold mb-2">
                {tableTitle}
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
                  {tableData.map((row, i) => (
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
