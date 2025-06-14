
import React, { useState, useRef } from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Dummy categories and product names
const categories = ["Electronics", "Apparel", "Toys", "Home", "Books"];
const productList = [
  "Product Alpha", "Product Beta", "Product Gamma", "Product Delta", "Product Zeta",
  "Product Lambda", "Product Xi", "Product Kappa", "Product Pi", "Product Sigma",
];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Dummy data generator (Top/Bottom 5 by quantity/sales)
const chartsDummy = (mode: "sales" | "quantity") => {
  let sorted = productList.map((name, idx) => ({
    name,
    category: categories[idx % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));
  sorted = sorted.sort((a, b) =>
    mode === "sales" ? b.sales - a.sales : b.quantity - a.quantity
  );
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  // Combine top5 and bottom5, de-duplicated
  const combined = [...top5, ...bottom5.filter(item => !top5.some(t => t.name === item.name))];
  return {
    top5,
    bottom5,
    combined,
    all: sorted,
  };
};

const pieColors = ["#4884d8", "#d8a448", "#6ed84d", "#e04db7", "#4dc9d8", "#fd5050"];

// Trend data generator
const trendDummy = (products: string[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months.map(month => {
    const entry: any = { month };
    products.forEach(product => {
      entry[product] = getRandomInt(3000, 16000);
    });
    return entry;
  });
};

export default function Visualization() {
  const [mode, setMode] = useState<"sales" | "quantity">("sales");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customViz, setCustomViz] = useState(false);

  const { top5, bottom5, combined } = chartsDummy(mode);

  // Custom Visualization: allow up to 10 products
  const handleProductToggle = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : prev.length < 10
        ? [...prev, product]
        : prev
    );
  };

  const selectedTrend = trendDummy(selectedProducts);

  // Refs for capturing charts
  const mainPieRef = useRef<HTMLDivElement>(null);
  const mainBarRef = useRef<HTMLDivElement>(null);
  const mainLineRef = useRef<HTMLDivElement>(null);
  const customPieRef = useRef<HTMLDivElement>(null);
  const customBarRef = useRef<HTMLDivElement>(null);
  const customLineRef = useRef<HTMLDivElement>(null);

  // PDF Export with images
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
    doc.text(`Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)} | Generated: ${(new Date()).toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
    y += 28;

    // Helper to capture images and add to PDF
    const renderAndAdd = async (element: HTMLDivElement | null, title: string, maxW: number, maxH: number, gap: number = 10) => {
      if (!element) return;
      // @ts-ignore
      const canvas = await html2canvas(element, { backgroundColor: "#18181b", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      let imgWidth = canvas.width;
      let imgHeight = canvas.height;

      // Fit image in the given bounding box (maxW, maxH)
      if (imgWidth > maxW) {
        const scale = maxW / imgWidth;
        imgWidth = maxW;
        imgHeight = imgHeight * scale;
      }
      if (imgHeight > maxH) {
        const scale = maxH / imgHeight;
        imgHeight = maxH;
        imgWidth = imgWidth * scale;
      }

      // Add title
      doc.setFontSize(13);
      doc.setTextColor("#1566B8");
      doc.text(title, 55, y);
      y += 16;

      doc.addImage(imgData, "PNG", 55, y, imgWidth, imgHeight, undefined, "FAST");
      y += imgHeight + gap;
    };

    // Default Visualizations (Top & Bottom 5)
    await renderAndAdd(mainPieRef.current, `Pie Chart: Product Category Distribution (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainBarRef.current, `Histogram: ${mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5 & Bottom 5)`, 340, 220, 12);
    await renderAndAdd(mainLineRef.current, `Line Chart: Annual Trend per Product (Top 5 & Bottom 5)`, 700, 260, 22);

    // Custom Visualization if present
    if (customViz && selectedProducts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor("#1aaf81");
      doc.text("Custom Visualization", 55, y);
      y += 16;

      await renderAndAdd(customPieRef.current, "Pie: Product Categories (Selected)", 340, 220, 10);
      await renderAndAdd(customBarRef.current, `Histogram: ${mode === "sales" ? "Sales" : "Quantity"} (Selected Products)`, 340, 220, 10);
      await renderAndAdd(customLineRef.current, "Line: Trend (Selected Products)", 700, 230, 16);
    }

    doc.save("Visualizations_Report.pdf");
  };

  // Main products to show in charts (top5 + bottom5 combined, de-duped)
  const mainProducts = combined;

  // For custom viz, pie needs quantity/sales sum, so we create simplified data:
  const customData = selectedProducts.map((name, idx) => {
    return {
      name,
      category: categories[productList.indexOf(name) % categories.length],
      sales: getRandomInt(5000, 20000),
      quantity: getRandomInt(25, 300),
    }
  });

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
        <Button
          className="bg-cosmic-gold text-black"
          onClick={handleDownloadPdf}
        >
          <Download className="w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Default Visualizations (Top 5 & Bottom 5 combined) */}
      <div className="flex flex-wrap gap-8 justify-center items-start mb-7 w-full max-w-5xl">
        {/* Pie Chart */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]" ref={mainPieRef}>
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Pie: Product Categories (Top 5 & Bottom 5)</div>
          <ResponsiveContainer width={300} height={200}>
            <PieChart>
              <Pie data={mainProducts} dataKey={mode} nameKey="category" cx="50%" cy="50%" outerRadius={65} label>
                {mainProducts.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Histogram */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]" ref={mainBarRef}>
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Histogram: {mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5 & Bottom 5)</div>
          <ResponsiveContainer width={300} height={200}>
            <BarChart data={mainProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={mode} fill="#4884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[700px] col-span-2" ref={mainLineRef}>
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Line: Annual Trend per Product (Top 5 & Bottom 5)</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendDummy(mainProducts.map(p => p.name))}>
              <XAxis dataKey="month"/>
              <YAxis />
              <Tooltip />
              {mainProducts.map((item, idx) => (
                <Line
                  type="monotone"
                  dataKey={item.name}
                  key={item.name}
                  stroke={pieColors[idx % pieColors.length]}
                  dot={false}
                />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Custom Viz box */}
      {customViz && (
        <div className="w-full max-w-3xl mb-10">
          <div className="bg-white/10 rounded-lg p-4 my-3 mb-6 shadow">
            <div className="font-semibold mb-2 text-cosmic-blue text-center">Select up to 10 products:</div>
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {productList.map(prod => (
                <Button
                  key={prod}
                  size="sm"
                  variant={selectedProducts.includes(prod) ? "default" : "outline"}
                  className={selectedProducts.includes(prod) ? "bg-cosmic-gold text-black" : ""}
                  onClick={() => handleProductToggle(prod)}
                >
                  {prod}
                </Button>
              ))}
            </div>
            <div className="text-center mb-2 text-xs text-cosmic-gold">
              {selectedProducts.length} selected / 10 max
            </div>
            {/* Table of selected */}
            {selectedProducts.length > 0 && (
              <table className="w-full text-left border rounded overflow-hidden text-slate-100 bg-black/60">
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
            )}
            {/* Custom Trends */}
            {selectedProducts.length > 0 && (
              <div className="my-5 bg-white/5 rounded-lg p-5">
                {/* Pie Chart Selected */}
                <div className="mb-6" ref={customPieRef}>
                  <div className="font-semibold mb-2 text-cosmic-blue text-center">Pie: Product Categories (Selected)</div>
                  <ResponsiveContainer width={300} height={200}>
                    <PieChart>
                      <Pie data={customData} dataKey={mode} nameKey="category" cx="50%" cy="50%" outerRadius={65} label>
                        {customData.map((entry, i) => (
                          <Cell key={`cell-selectedpie-${i}`} fill={pieColors[i % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Histogram Selected */}
                <div className="mb-6" ref={customBarRef}>
                  <div className="font-semibold mb-2 text-cosmic-blue text-center">Histogram: {mode === "sales" ? "Sales" : "Quantity"} (Selected Products)</div>
                  <ResponsiveContainer width={300} height={200}>
                    <BarChart data={customData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={mode} fill="#4884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Line Chart Selected */}
                <div ref={customLineRef}>
                  <div className="font-semibold mb-2 text-cosmic-blue text-center">Line: Trend (Selected Products)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={selectedTrend}>
                      <XAxis dataKey="month"/>
                      <YAxis />
                      <Tooltip />
                      {selectedProducts.map((prod, idx) => (
                        <Line
                          key={prod}
                          type="monotone"
                          dataKey={prod}
                          stroke={pieColors[idx%pieColors.length]}
                          dot={false}
                        />
                      ))}
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
