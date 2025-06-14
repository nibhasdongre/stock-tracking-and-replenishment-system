import React, { useState, useRef } from "react";
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
import { categories, productList, chartsDummy, pieColors, trendDummy, getRandomInt } from "./visualizationUtils";

export default function VisualizationPage() {
  const [mode, setMode] = useState<"sales" | "quantity">("sales");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customViz, setCustomViz] = useState(false);

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

  // Helper to render a matrix image, similar to Summary page
  const renderAndAddMatrix = async (doc: any, element: HTMLDivElement | null, title: string, maxW: number, maxH: number, y: number, opts: {center?:boolean} = {}) => {
    if (!element) return y;
    const pageWidth = doc.internal.pageSize.getWidth();
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
    let scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
    imgWidth = imgWidth * scale;
    imgHeight = imgHeight * scale;
    doc.setFontSize(13);
    doc.setTextColor("#1566B8");
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
  const summaryTableData = [
    { name: "Product Beta", quantity: 401, sales: 12050 },
    { name: "Product Alpha", quantity: 389, sales: 11700 },
    { name: "Product Gamma", quantity: 318, sales: 10680 },
    { name: "Product Delta", quantity: 283, sales: 10290 },
    { name: "Product Zeta", quantity: 269, sales: 9850 },
  ];
  const currentDateString = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  // PDF Export
  const handleDownloadPdf = async () => {
    // Only enable for custom viz and selected products, enforced in visible download button
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 30;

    // 1. Title
    doc.setFontSize(20);
    doc.setTextColor("#1566B8");
    doc.text("Visualizations Report", pageWidth / 2, y, { align: "center" });

    y += 30;
    // 2. Subtitle: date & mode
    doc.setFontSize(12);
    doc.setTextColor("#111");
    doc.text(
      `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)} | Generated: ${currentDateString}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 22;

    // Helper for image capture (no cropping)
    const renderAndAdd = async (element: HTMLDivElement | null, title: string, maxW: number, maxH: number, gap: number = 10, opts: {center?:boolean} = {}) => {
      if (!element) return;
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

      let scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
      imgWidth = imgWidth * scale;
      imgHeight = imgHeight * scale;

      doc.setFontSize(13);
      doc.setTextColor("#1566B8");
      if (opts.center) {
        doc.text(title, pageWidth / 2, y, { align: "center" });
      } else {
        doc.text(title, 55, y);
      }
      y += 16;
      doc.addImage(imgData, "PNG", opts.center ? (pageWidth - imgWidth) / 2 : 55, y, imgWidth, imgHeight, undefined, "FAST");
      y += imgHeight + gap;
    };

    // 3. Matrix (SummaryMatrix as image)
    if (summaryMatrixRef.current) {
      y = await renderAndAddMatrix(doc, summaryMatrixRef.current, "Top 5 & Bottom 5 Products", pageWidth-80, 220, y, {center:true});
    }

    // 4. Main summary table
    if (summaryTableRef.current) {
      await renderAndAdd(summaryTableRef.current, "Summary Table", pageWidth-80, 170, 12, {center:true});
    }

    // 5. Default Visualizations (Pie, Bar, Line)
    await renderAndAdd(mainPieRef.current, `Pie Chart: Product Category Distribution (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainBarRef.current, `Histogram: ${mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainLineRef.current, `Line Chart: Annual Trend per Product (Top 5 & Bottom 5)`, 700, 260, 22);

    // 6. If custom viz, show at end
    if (customViz && selectedProducts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor("#1aaf81");
      doc.text("Custom Visualization", 55, y);
      y += 16;

      // Custom selected product table
      if (customProductsTableRef.current) {
        await renderAndAdd(customProductsTableRef.current, "Selected Products Table", 350, 160, 15);
      }
      // Custom charts
      await renderAndAdd(customPieRef.current, "Pie: Product Categories (Selected)", 340, 220, 10);
      await renderAndAdd(customBarRef.current, `Histogram: ${mode === "sales" ? "Sales" : "Quantity"} (Selected Products)`, 340, 220, 10);
      await renderAndAdd(customLineRef.current, "Line: Trend (Selected Products)", 700, 230, 16);
    }

    doc.save("Visualizations_Report.pdf");
  };

  // Custom data for charts
  const customData = selectedProducts.map((name, idx) => ({
    name,
    category: categories[productList.indexOf(name) % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));

  // For summary table (Top5+Bottom5)
  const summaryTableData = [...top5, ...bottom5.filter(item => !top5.some(t => t.name === item.name))];

  return (
    <div className="min-h-screen py-10 bg-background flex flex-col items-center">
      <h2 className="text-center text-cosmic-blue text-2xl sm:text-3xl font-bold mb-3 uppercase font-sans">
        Visualizations
      </h2>
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
          onClick={() => { setCustomViz(s => !s); setSelectedProducts([]); }}
          className="border-cosmic-gold text-cosmic-gold"
        >
          Custom Visualization
        </Button>
        {customViz && selectedProducts.length > 0 && (
          <Button
            className="bg-cosmic-gold text-black"
            onClick={handleDownloadPdf}
          >
            <Download className="w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>

      {/* Default Visualizations */}
      <div className="flex flex-wrap gap-8 justify-center items-start mb-7 w-full max-w-5xl">
        {/* Main summary table (for PDF) */}
        <div style={{display:"none"}}>
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
                {summaryTableData.map((row, i) => (
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
        <div className="w-full max-w-3xl mb-10">
          <div className="bg-white/10 rounded-lg p-4 my-3 mb-6 shadow">
            <div className="font-semibold mb-2 text-cosmic-blue text-center">Select up to 10 products:</div>
            <ProductSearchSelect
              allProducts={productList}
              selectedProducts={selectedProducts}
              max={10}
              onChange={setSelectedProducts}
            />
            {selectedProducts.length > 0 && (
              <div ref={customProductsTableRef}>
                <table className="w-full text-left border rounded overflow-hidden text-slate-100 bg-black/60 mt-4">
                  <thead className="bg-cosmic-blue text-black">
                    <tr>
                      <th className="p-2">Product</th>
                      <th className="p-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((prod, i) => (
                      <tr key={i}>
                        <td className="p-2">{prod}</td>
                        <td className="p-2">{categories[productList.indexOf(prod)%categories.length]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedProducts.length > 0 && (
              <div className="my-5 bg-white/5 rounded-lg p-5">
                <div ref={customPieRef}>
                  <CustomPieChart data={customData} mode={mode} />
                </div>
                <div ref={customBarRef}>
                  <CustomBarChart data={customData} mode={mode} />
                </div>
                <div ref={customLineRef}>
                  <CustomLineChart selectedProducts={selectedProducts} trendData={selectedTrend} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{display: "none"}}>
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
    </div>
  );
}
