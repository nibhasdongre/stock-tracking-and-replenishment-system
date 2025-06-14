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

  // PDF Export
  const handleDownloadPdf = async () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 30;

    doc.setFontSize(20);
    doc.setTextColor("#1566B8");
    doc.text("Visualizations Report", pageWidth / 2, y, { align: "center" });

    y += 30;
    doc.setFontSize(12);
    doc.setTextColor("#111");
    doc.text(
      `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)} | Generated: ${(new Date()).toLocaleDateString()}`,
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

    // Add main summary table
    if (summaryTableRef.current) {
      await renderAndAdd(summaryTableRef.current, "Summary Table", pageWidth-80, 170, 12, {center:true});
    }

    // Default Visualizations (Top & Bottom 5, main charts)
    await renderAndAdd(mainPieRef.current, `Pie Chart: Product Category Distribution (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainBarRef.current, `Histogram: ${mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainLineRef.current, `Line Chart: Annual Trend per Product (Top 5 & Bottom 5)`, 700, 260, 22);

    // Custom Visualization, if any
    if (customViz && selectedProducts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor("#1aaf81");
      doc.text("Custom Visualization", 55, y);
      y += 16;

      // Selected products table (image for consistent look)
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
    </div>
  );
}
