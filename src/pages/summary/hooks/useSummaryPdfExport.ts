
import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTodayDisplay } from "../pdfExportHelpers";

type Product = { name: string; value: number };
type Row = { name: string; quantity: number; sales: number };

export interface PdfExportParams {
  visibleReportType: "none" | "monthly" | "annual";
  pdfTitle: string;
  pdfSubTitle: string;
  topQuantity: Product[];
  bottomQuantity: Product[];
  topSales: Product[];
  bottomSales: Product[];
  summaryTableData: Row[];
  pdfMonth: string;
  pdfYear: string;
  setExporting: (x: boolean) => void;
}

export function useSummaryPdfExport() {
  const [exporting, setExporting] = useState(false);

  const handleDownloadPdf = useCallback(
    async ({
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
    }: PdfExportParams) => {
      if (visibleReportType === "none") return;
      setExporting(true);

      try {
        const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 64;

        // 1. Title Heading
        doc.setFontSize(22);
        doc.setTextColor("#1566B8");
        doc.text(pdfTitle, pageWidth / 2, y, { align: "center" });
        y += 26;

        // 2. Date
        doc.setFontSize(13);
        doc.setTextColor(40);
        doc.text(getTodayDisplay(), pageWidth / 2, y, { align: "center" });
        y += 14;

        // 3. Subtitle (month or year)
        doc.setFontSize(15);
        doc.setTextColor("#AA8500");
        doc.text(pdfSubTitle, pageWidth / 2, y, { align: "center" });
        y += 30;

        // 4. Top 5 & Bottom 5 - Quantity
        doc.setFontSize(14);
        doc.setTextColor("#1566B8");
        doc.text("Top 5 Products (Quantity)", 55, y);
        doc.setTextColor(0);
        const topQuantityTable = autoTable(doc, {
          startY: y + 8,
          head: [["#", "Product", "Quantity"]],
          body: topQuantity.map((p, idx) => [idx + 1, p.name, p.value]),
          styles: { fontSize: 10 },
          theme: "grid",
          headStyles: { fillColor: [21, 102, 184], textColor: "#fff" },
          margin: { left: 55, right: 55 },
          tableWidth: pageWidth - 110,
        });
        y = (topQuantityTable?.finalY ?? y) + 10;

        doc.setTextColor("#1566B8");
        doc.text("Bottom 5 Products (Quantity)", 55, y);
        doc.setTextColor(0);
        const bottomQuantityTable = autoTable(doc, {
          startY: y + 8,
          head: [["#", "Product", "Quantity"]],
          body: bottomQuantity.map((p, idx) => [idx + 1, p.name, p.value]),
          styles: { fontSize: 10 },
          theme: "grid",
          headStyles: { fillColor: [21, 102, 184], textColor: "#fff" },
          margin: { left: 55, right: 55 },
          tableWidth: pageWidth - 110,
        });
        y = (bottomQuantityTable?.finalY ?? y) + 20;

        // 5. Top 5 & Bottom 5 - Sales
        doc.setFontSize(14);
        doc.setTextColor("#AA8500");
        doc.text("Top 5 Products (Sales)", 55, y);
        doc.setTextColor(0);
        const topSalesTable = autoTable(doc, {
          startY: y + 8,
          head: [["#", "Product", "Sales"]],
          body: topSales.map((p, idx) => [idx + 1, p.name, p.value]),
          styles: { fontSize: 10 },
          theme: "grid",
          headStyles: { fillColor: [170, 133, 0], textColor: "#fff" },
          margin: { left: 55, right: 55 },
          tableWidth: pageWidth - 110,
        });
        y = (topSalesTable?.finalY ?? y) + 10;

        doc.setTextColor("#AA8500");
        doc.text("Bottom 5 Products (Sales)", 55, y);
        doc.setTextColor(0);
        const bottomSalesTable = autoTable(doc, {
          startY: y + 8,
          head: [["#", "Product", "Sales"]],
          body: bottomSales.map((p, idx) => [idx + 1, p.name, p.value]),
          styles: { fontSize: 10 },
          theme: "grid",
          headStyles: { fillColor: [170, 133, 0], textColor: "#fff" },
          margin: { left: 55, right: 55 },
          tableWidth: pageWidth - 110,
        });
        y = (bottomSalesTable?.finalY ?? y) + 24;

        // 6. Summary Table (as table)
        doc.setFontSize(15);
        doc.setTextColor("#1566B8");
        doc.text("Sales & Quantity Summary Table", 55, y);
        doc.setTextColor(20);
        autoTable(doc, {
          startY: y + 8,
          head: [["#", "Product", "Quantity", "Sales"]],
          body: summaryTableData.map((row, idx) => [
            idx + 1,
            row.name,
            row.quantity,
            row.sales,
          ]),
          styles: { fontSize: 11 },
          theme: "grid",
          headStyles: { fillColor: [21, 102, 184], textColor: "#fff" },
          margin: { left: 55, right: 55 },
          tableWidth: pageWidth - 110,
        });

        doc.save(
          visibleReportType === "monthly"
            ? `Summary_${pdfMonth}-${pdfYear}.pdf`
            : `Summary_${pdfYear}.pdf`
        );
      } catch (e) {
        console.error("PDF Export error:", e);
        alert("PDF Export failed. Please retry.");
      } finally {
        setExporting(false);
      }
    },
    []
  );

  return { exporting, setExporting, handleDownloadPdf };
}
