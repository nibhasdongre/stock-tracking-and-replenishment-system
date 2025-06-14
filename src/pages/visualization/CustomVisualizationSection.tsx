
import React from "react";
import CustomPieChart from "./CustomPieChart";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";
import ProductSearchSelect from "@/components/ProductSearchSelect";
import { categories, productList, pieColors, getRandomInt, trendDummy } from "./visualizationUtils";

interface Props {
  mode: "sales" | "quantity";
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  customPieRef: React.RefObject<HTMLDivElement>;
  customBarRef: React.RefObject<HTMLDivElement>;
  customLineRef: React.RefObject<HTMLDivElement>;
  customProductsTableRef: React.RefObject<HTMLDivElement>;
}

export default function CustomVisualizationSection({
  mode,
  selectedProducts,
  setSelectedProducts,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  customPieRef,
  customBarRef,
  customLineRef,
  customProductsTableRef,
}: Props) {
  // Generate data for custom charts
  const customData = selectedProducts.map((name, idx) => ({
    name,
    category: categories[productList.indexOf(name) % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));
  const selectedTrend = trendDummy(selectedProducts);

  // Date input helpers
  const formatToDdMmYyyy = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
  };

  return (
    <div className="w-full max-w-3xl mb-10">
      <div className="bg-white/10 rounded-lg p-4 my-3 mb-6 shadow">
        <div className="font-semibold mb-2 text-cosmic-blue text-center">Select up to 10 products:</div>

        {/* Start / End Date - row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3">
          <label className="text-sm text-cosmic-gold font-semibold flex items-center gap-2">
            Start Date:
            <input
              type="date"
              className="rounded px-2 py-1 border border-cosmic-gold text-black"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{minWidth: 140}}
            />
          </label>
          <label className="text-sm text-cosmic-gold font-semibold flex items-center gap-2">
            End Date:
            <input
              type="date"
              className="rounded px-2 py-1 border border-cosmic-gold text-black"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{minWidth: 140}}
            />
          </label>
        </div>

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
  );
}
