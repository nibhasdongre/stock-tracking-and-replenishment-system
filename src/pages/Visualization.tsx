
import React, { useState } from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Dummy categories and product names
const categories = ["Electronics", "Apparel", "Toys", "Home", "Books"];
const productList = [
  "Product Alpha", "Product Beta", "Product Gamma", "Product Delta", "Product Zeta",
  "Product Lambda", "Product Xi", "Product Kappa", "Product Pi", "Product Sigma",
];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Dummy data for charts (Top/Bottom 5 by quantity/sales, and dummy yearly trend)
const chartsDummy = (mode: "sales" | "quantity") => {
  // Generate top 5 and bottom 5
  let sorted = productList.map((name, idx) => ({
    name,
    category: categories[idx % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));
  sorted = sorted.sort((a, b) =>
    mode === "sales" ? b.sales - a.sales : b.quantity - a.quantity
  );
  return {
    top5: sorted.slice(0, 5),
    bottom5: sorted.slice(-5).reverse(),
    all: sorted,
  };
};

const pieColors = ["#4884d8", "#d8a448", "#6ed84d", "#e04db7", "#4dc9d8", "#fd5050"];

// Dummy sales/qty trend data throughout a year
const trendDummy = (products: string[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months.map(month => {
    const entry: any = { month };
    products.forEach((product, idx) => {
      entry[product] = getRandomInt(3000, 16000);
    });
    return entry;
  });
};

export default function Visualization() {
  const [mode, setMode] = useState<"sales" | "quantity">("sales");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customViz, setCustomViz] = useState(false);

  const { top5, bottom5, all } = chartsDummy(mode);

  // Custom Visualization : allow up to 10 products
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

  // PDF Export w/ all visuals
  const handleDownloadPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 30;

    doc.setFontSize(20);
    doc.setTextColor("#1566B8");
    doc.text("Visualizations Report", pageWidth/2, y, { align: "center" });

    y += 24;
    doc.setFontSize(12);
    doc.setTextColor("#111");
    doc.text(`Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)} | Generated: ${(new Date()).toLocaleDateString()}`, pageWidth/2, y, { align: "center" });
    y += 24;

    // Top 5/Bot 5 table
    autoTable(doc, {
      startY: y,
      head: [[`Top 5 Products by ${mode.charAt(0).toUpperCase()+mode.slice(1)}`, `Bottom 5 Products by ${mode.charAt(0).toUpperCase()+mode.slice(1)}`]],
      body: Array.from({length: 5}).map((_, i) => [
        top5[i] ? `${top5[i].name} (${top5[i].category}) - ${top5[i][mode]}` : "",
        bottom5[i] ? `${bottom5[i].name} (${bottom5[i].category}) - ${bottom5[i][mode]}` : "",
      ]),
      theme: "grid",
      styles: { fontSize: 11 },
      tableWidth: pageWidth - 80,
      margin: { left: 40, right: 40 },
    });

    y = (doc as any).lastAutoTable.finalY + 16;

    // Pie Chart description
    doc.setFontSize(14);
    doc.setTextColor("#4884d8");
    doc.text("Pie Chart: Product Category Distribution (Top 5)", 55, y);
    y += 14;
    // Statically render legend - no image/chart
    top5.forEach((item, i) => {
      doc.setFontSize(11);
      doc.setTextColor(pieColors[i%pieColors.length]);
      doc.text(`${item.name} - ${item.category}: ${item[mode]}`, 55, y);
      y += 14;
    });
    y += 10;

    // Histogram description
    doc.setFontSize(14);
    doc.setTextColor("#e07d4d");
    doc.text(`Histogram: ${mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5)`, 55, y);
    y += 14;
    top5.forEach(item => {
      doc.setFontSize(11);
      doc.setTextColor("#222");
      doc.text(`${item.name}: ${item[mode]}`, 55, y);
      y += 12;
    });
    y += 8;

    // Line Chart description
    doc.setFontSize(14);
    doc.setTextColor("#4dc9d8");
    doc.text("Line Chart: Yearly Sales Trend for Top 5 Products", 55, y);
    y += 14;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((mon, idx) => {
      let line = `${mon}: `;
      top5.forEach(item => {
        line += `${item.name.split(" ")[1]} ${getRandomInt(1000, 14000)}, `;
      });
      doc.setFontSize(9);
      doc.setTextColor("#222");
      doc.text(line.slice(0, -2), 55, y);
      y += 10;
    });
    y += 16;

    // Custom Visualization if present
    if (customViz && selectedProducts.length > 0) {
      doc.setFontSize(15);
      doc.setTextColor("#1aaf81");
      doc.text("Custom Visualization (Selected Products):", 55, y);
      y += 16;

      // Table of selected products
      autoTable(doc, {
        startY: y,
        head: [["Product", "Category"]],
        body: selectedProducts.map(name => {
          const cat = categories[productList.indexOf(name)%categories.length];
          return [name, cat];
        }),
        theme: "striped",
        styles: { fontSize: 11 },
        margin: { left: 55 },
        tableWidth: pageWidth - 110,
      });
      y = (doc as any).lastAutoTable.finalY + 12;

      // Dummy description for each selected
      doc.setFontSize(11);
      selectedProducts.forEach((prod, idx) => {
        doc.setTextColor(pieColors[idx%pieColors.length]);
        doc.text(`Product: ${prod} - Trend (see line chart above)`, 55, y);
        y += 12;
      });
    }

    doc.save("Visualizations_Report.pdf");
  };

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
          onClick={() => setCustomViz(s => !s)}
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

      {/* Top/bottom 5 grouping for current mode */}
      <div className="flex flex-wrap gap-8 justify-center items-start mb-7 w-full max-w-5xl">
        {/* Pie Chart */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]">
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Pie: Product Categories (Top 5)</div>
          <ResponsiveContainer width={300} height={200}>
            <PieChart>
              <Pie data={top5} dataKey={mode} nameKey="category" cx="50%" cy="50%" outerRadius={65} label>
                {top5.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Histogram */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[340px]">
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Histogram: {mode === "sales" ? "Sales" : "Quantity"} per Product (Top 5)</div>
          <ResponsiveContainer width={300} height={200}>
            <BarChart data={top5}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={mode} fill="#4884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-[700px] col-span-2">
          <div className="font-semibold mb-2 text-cosmic-blue text-center">Line: Annual Trend per Product (Top 5)</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendDummy(top5.map(p => p.name))}>
              <XAxis dataKey="month"/>
              <YAxis />
              <Tooltip />
              {top5.map((item, idx) => (
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
        {/* Bottom 5 Table */}
        <div className="bg-white/10 rounded-lg p-4 shadow w-full">
          <div className="font-semibold mb-3 text-cosmic-gold text-center">Bottom 5 Products (by {mode})</div>
          <table className="w-full text-left border rounded overflow-hidden text-slate-100">
            <thead className="bg-cosmic-blue text-black">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Category</th>
                <th className="p-2">{mode === "sales" ? "Sales" : "Quantity"}</th>
              </tr>
            </thead>
            <tbody>
              {bottom5.map((row, i) => (
                <tr key={i} className="bg-black/70 border-b last:border-0">
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.category}</td>
                  <td className="p-2">{row[mode]}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <div className="font-semibold text-cosmic-blue mb-3 text-center">Custom Line Chart: Trends for Selected Products</div>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
