import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProductSearchSelect from "@/components/ProductSearchSelect";
import MainPieChart from "./MainPieChart";
import MainBarChart from "./MainBarChart";
import MainLineChart from "./MainLineChart";
import CustomPieChart from "./CustomPieChart";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";
import CustomVisualizationSection from "./CustomVisualizationSection";
import { categories, productList, chartsDummy, pieColors, trendDummy, getRandomInt } from "./visualizationUtils";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import AccessHeader from "@/components/AccessHeader";
import InvalidRequestDialog from "@/components/InvalidRequestDialog";
import { useSessionAccess } from "@/hooks/useSessionAccess";
import { useNavigate } from "react-router-dom";

export default function VisualizationPage() {
  const [mode, setMode] = useState<"sales" | "quantity">("sales");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customViz, setCustomViz] = useState(false);

  // New: state for custom viz start/end dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const { top5, bottom5, combined } = chartsDummy(mode);

  const selectedTrend = trendDummy(selectedProducts);

  // Refs (default)
  const mainPieRef = useRef<HTMLDivElement>(null);
  const mainBarRef = useRef<HTMLDivElement>(null);
  const mainLineRef = useRef<HTMLDivElement>(null);

  // Custom Viz refs
  const customPieRef = useRef<HTMLDivElement>(null);
  const customBarRef = useRef<HTMLDivElement>(null);
  const customLineRef = useRef<HTMLDivElement>(null);

  // Summary Table/data for PDF
  const summaryTableRef = useRef<HTMLDivElement>(null);

  // Selected products table ref
  const customProductsTableRef = useRef<HTMLDivElement>(null);

  // Prepare: Refs for summary matrix (for image export)
  const summaryMatrixRef = useRef<HTMLDivElement>(null);

  // Ref to visualize the WHOLE page for PDF
  const pageRef = useRef<HTMLDivElement>(null);

  // Access control
  const { accessLevel, setLevel } = useSessionAccess();
  const [showInvalid, setShowInvalid] = useState(false);
  const navigate = useNavigate();

  // Block access if not L3
  React.useEffect(() => {
    if (accessLevel !== "L3") setShowInvalid(true);
  }, [accessLevel]);

  function handleInvalidClose(open: boolean) {
    setShowInvalid(open);
    if (!open) navigate("/");
  }

  // --- Read the search params for month and year from Summary page, if present
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const summaryMonth = queryParams.get("month");
  const summaryYear = queryParams.get("year");

  // Always set title to show "MMMM yyyy" if both values are present and valid:
  let summaryTitle = "Visualizations";
  if (summaryMonth && summaryYear) {
    const monthInt = Number(summaryMonth);
    const yearInt = Number(summaryYear);
    if (!isNaN(monthInt) && !isNaN(yearInt) && monthInt >= 1 && monthInt <= 12) {
      const date = new Date(yearInt, monthInt - 1, 1);
      summaryTitle = format(date, "MMMM yyyy");
    }
  }

  // Default data for summary page (used in both summary and viz PDF)
  const matrixData = {
    topQuantity: [
      { name: "Product Alpha", value: 220 },
      { name: "Product Beta", value: 170 },
      { name: "Product Gamma", value: 156 },
      { name: "Product Delta", value: 132 },
      { name: "Product Zeta", value: 120 },
    ],
    bottomQuantity: [
      { name: "Product Lambda", value: 13 },
      { name: "Product Xi", value: 15 },
      { name: "Product Kappa", value: 22 },
      { name: "Product Pi", value: 35 },
      { name: "Product Sigma", value: 38 },
    ],
    topSales: [
      { name: "Product Beta", value: 12050 },
      { name: "Product Alpha", value: 11700 },
      { name: "Product Gamma", value: 10680 },
      { name: "Product Delta", value: 10290 },
      { name: "Product Zeta", value: 9850 },
    ],
    bottomSales: [
      { name: "Product Lambda", value: 1180 },
      { name: "Product Xi", value: 1295 },
      { name: "Product Kappa", value: 1630 },
      { name: "Product Pi", value: 1780 },
      { name: "Product Sigma", value: 1900 },
    ],
  };

  // Renamed this variable to avoid redeclaration error
  // Now adds 'category' calculated from the productList/categories mapping
  const demoSummaryTableData = [
    { name: "Product Beta", quantity: 401, sales: 12050, category: categories[productList.indexOf("Product Beta") % categories.length] },
    { name: "Product Alpha", quantity: 389, sales: 11700, category: categories[productList.indexOf("Product Alpha") % categories.length] },
    { name: "Product Gamma", quantity: 318, sales: 10680, category: categories[productList.indexOf("Product Gamma") % categories.length] },
    { name: "Product Delta", quantity: 283, sales: 10290, category: categories[productList.indexOf("Product Delta") % categories.length] },
    { name: "Product Zeta", quantity: 269, sales: 9850, category: categories[productList.indexOf("Product Zeta") % categories.length] },
  ];

  const currentDateString = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  // PDF Export (new: capture whole visible visualization page!)
  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      if (!pageRef.current) throw new Error("Visualization page not available for export");

      // Render the entire visible main container
      const canvas = await html2canvas(pageRef.current, {
        backgroundColor: "#18181b",
        scale: 2,
        useCORS: true,
        width: pageRef.current.scrollWidth,
        height: pageRef.current.scrollHeight,
        windowWidth: pageRef.current.scrollWidth,
        windowHeight: pageRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      // Calculate pdf page size and scale
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let imgWidth = canvas.width;
      let imgHeight = canvas.height;
      // scale down if image is larger than page
      const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight, 1);

      imgWidth = imgWidth * scale;
      imgHeight = imgHeight * scale;

      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - imgWidth) / 2,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight
      );
      pdf.save("Visualization_Page.pdf");
    } catch (err: any) {
      console.error("PDF export failed:", err);
      toast({
        title: "Export failed",
        description: "There was a problem generating your PDF. Please try again or refresh.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Custom data for charts
  const customData = selectedProducts.map((name, idx) => ({
    name,
    category: categories[productList.indexOf(name) % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));

  // For summary table (Top5+Bottom5 with category for PDF)
  const summaryTableData = [
    ...top5.map(item => ({
      ...item,
      category: categories[productList.indexOf(item.name) % categories.length],
    })),
    ...bottom5
      .filter(item => !top5.some(t => t.name === item.name))
      .map(item => ({
        ...item,
        category: categories[productList.indexOf(item.name) % categories.length],
      })),
  ];

  // Utility for hidden export: use position absolute, not display:none
  const hiddenExportStyle = {
    position: "absolute" as const,
    left: "-9999px",
    top: "-9999px",
    visibility: "hidden" as const,
    pointerEvents: "none" as const,
    height: "auto",
    width: "auto",
    zIndex: -1,
  };

  return (
    <div ref={pageRef} className="min-h-screen py-10 bg-background flex flex-col items-center">
      <AccessHeader />
      <InvalidRequestDialog open={showInvalid} onOpenChange={handleInvalidClose} />
      {!showInvalid && (
        <>
          <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-1 uppercase font-sans">
            {summaryTitle}
          </h2>
          <div className="text-center text-cosmic-gold text-lg mb-4 font-semibold">
            {summaryMonth && summaryYear ? "Visualization for selected period" : ""}
          </div>
          <div className="flex gap-4 mb-7">
            <Button
              className={mode === "sales" ? "bg-cosmic-blue text-cosmic-gold" : ""}
              onClick={() => setMode("sales")}
            >
              By Sales
            </Button>
            <Button
              className={mode === "quantity" ? "bg-cosmic-blue text-cosmic-gold" : ""}
              onClick={() => setMode("quantity")}
            >
              By Quantity
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCustomViz(s => !s);
                setSelectedProducts([]);
                setStartDate("");
                setEndDate("");
              }}
              className="border-cosmic-gold text-cosmic-gold"
            >
              Custom Visualization
            </Button>
            <Button
              variant="outline"
              className="border-cosmic-gold text-cosmic-gold whitespace-nowrap font-semibold"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Download as PDF"}
            </Button>
          </div>

          {/* Default Visualizations */}
          <div className="flex flex-wrap gap-8 justify-center items-start mb-7 w-full max-w-5xl">
            <div style={hiddenExportStyle}>
              <div ref={summaryTableRef}>
                <table className="w-full border text-slate-100 rounded-lg overflow-hidden text-base">
                  <thead>
                    <tr className="bg-cosmic-blue text-black">
                      <th className="p-2">Product</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoSummaryTableData.map((row, i) => (
                      <tr key={i} className="bg-black/70 border-b last:border-0">
                        <td className="p-2">{row.name}</td>
                        <td className="p-2">{row.category}</td>
                        <td className="p-2 text-center">{row.quantity}</td>
                        <td className="p-2 text-center">{row.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div ref={mainPieRef}>
              <MainPieChart data={combined} mode={mode} />
            </div>
            <div ref={mainBarRef}>
              <MainBarChart data={combined} mode={mode} />
            </div>
            <div ref={mainLineRef}>
              <MainLineChart products={combined} mode={mode} trendData={trendDummy(combined.map(p => p.name))} />
            </div>
          </div>
          {/* Custom Viz */}
          {customViz && (
            <CustomVisualizationSection
              mode={mode}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              customPieRef={customPieRef}
              customBarRef={customBarRef}
              customLineRef={customLineRef}
              customProductsTableRef={customProductsTableRef}
            />
          )}
          <div style={hiddenExportStyle}>
            {/* Exportable matrix for PDF */}
            <div ref={summaryMatrixRef}>
              {/* Copy-paste the SummaryMatrix with hardcoded demo data as used in Summary */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Quantity column */}
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-900 bg-opacity-70 border border-cosmic-blue rounded-xl p-4 shadow">
                    <div className="font-bold text-cosmic-blue text-lg mb-2 text-center">Top 5 Products (Quantity)</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-200">
                      {matrixData.topQuantity.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="font-semibold pl-3">{item.value}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="bg-slate-900 bg-opacity-70 border border-cosmic-blue rounded-xl p-4 shadow">
                    <div className="font-bold text-cosmic-blue text-lg mb-2 text-center">Bottom 5 Products (Quantity)</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-200">
                      {matrixData.bottomQuantity.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="font-semibold pl-3">{item.value}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                {/* Sales column */}
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-900 bg-opacity-70 border border-cosmic-gold rounded-xl p-4 shadow">
                    <div className="font-bold text-cosmic-gold text-lg mb-2 text-center">Top 5 Products (Sales)</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-200">
                      {matrixData.topSales.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="font-semibold pl-3">{item.value}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="bg-slate-900 bg-opacity-70 border border-cosmic-gold rounded-xl p-4 shadow">
                    <div className="font-bold text-cosmic-gold text-lg mb-2 text-center">Bottom 5 Products (Sales)</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-200">
                      {matrixData.bottomSales.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="truncate">{item.name}</span>
                          <span className="font-semibold pl-3">{item.value}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
