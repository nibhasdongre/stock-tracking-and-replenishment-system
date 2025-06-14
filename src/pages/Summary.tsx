import React, { useState, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import SummaryMatrix from "@/components/SummaryMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BarChartHorizontal, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // PDF export: include dynamic title, month/year, summary boxes, and table using autoTable
  const handleDownloadPdf = () => {
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

    // 4 summary boxes side by side: two columns: Quantity and Sales (each with top/bottom 5)
    y += 25;

    autoTable(doc, {
      startY: y,
      head: [
        [
          { content: "Top 5 Products (Quantity)", styles: { halign: 'center', fillColor: "#d9e7fa", textColor: "#1566B8" } },
          { content: "Top 5 Products (Sales)", styles: { halign: 'center', fillColor: "#fff9cf", textColor: "#C7B042" } },
        ]
      ],
      body: Array.from({ length: 5 }).map((_, i) => [
        `${topQuantity[i]?.name ?? ""} ${topQuantity[i]?.value !== undefined ? " - " + topQuantity[i]?.value : ""}`,
        `${topSales[i]?.name ?? ""} ${topSales[i]?.value !== undefined ? " - " + topSales[i]?.value : ""}`,
      ]),
      theme: "grid",
      styles: {
        fontSize: 10, cellPadding: { top: 2, bottom: 2, left: 4, right: 4 }, overflow: 'linebreak'
      },
      margin: { left: 40, right: 40 },
      tableWidth: pageWidth - 80,
      didDrawPage: data => {
        // Only first box on first page: place bottom box header after it
      }
    });

    let nextY = (doc as any).lastAutoTable.finalY + 8;

    autoTable(doc, {
      startY: nextY,
      head: [
        [
          { content: "Bottom 5 Products (Quantity)", styles: { halign: 'center', fillColor: "#d9e7fa", textColor: "#1566B8" } },
          { content: "Bottom 5 Products (Sales)", styles: { halign: 'center', fillColor: "#fff9cf", textColor: "#C7B042" } },
        ]
      ],
      body: Array.from({ length: 5 }).map((_, i) => [
        `${bottomQuantity[i]?.name ?? ""} ${bottomQuantity[i]?.value !== undefined ? " - " + bottomQuantity[i]?.value : ""}`,
        `${bottomSales[i]?.name ?? ""} ${bottomSales[i]?.value !== undefined ? " - " + bottomSales[i]?.value : ""}`,
      ]),
      theme: "grid",
      styles: {
        fontSize: 10, cellPadding: { top: 2, bottom: 2, left: 4, right: 4 }, overflow: 'linebreak'
      },
      margin: { left: 40, right: 40 },
      tableWidth: pageWidth - 80,
    });

    nextY = (doc as any).lastAutoTable.finalY + 16;

    // Data Table
    autoTable(doc, {
      startY: nextY,
      head: [
        [
          { content: "Product", styles: { halign: "center", fillColor: "#d9e7fa", textColor: "#1566B8" } },
          { content: "Quantity", styles: { halign: "center", fillColor: "#d9e7fa", textColor: "#1566B8" } },
          { content: "Sales", styles: { halign: "center", fillColor: "#d9e7fa", textColor: "#1566B8" } },
        ]
      ],
      body: tableData.map(row => [
        row.name,
        row.quantity,
        row.sales
      ]),
      theme: "striped",
      styles: {
        fontSize: 11,
        halign: "center",
        cellWidth: "wrap",
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: (pageWidth - 80) * 0.45 },
        1: { cellWidth: (pageWidth - 80) * 0.15 },
        2: { cellWidth: (pageWidth - 80) * 0.24 },
      },
      margin: { left: 40, right: 40 },
      tableWidth: pageWidth - 80,
    });

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
        <SummaryMatrix
          topQuantity={topQuantity}
          bottomQuantity={bottomQuantity}
          topSales={topSales}
          bottomSales={bottomSales}
        />
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
            {/* Visible summary table */}
            <div>
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
