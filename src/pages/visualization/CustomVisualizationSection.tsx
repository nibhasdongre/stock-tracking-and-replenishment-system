
import React from "react";
import CustomPieChart from "./CustomPieChart";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";
import ProductSearchSelect from "@/components/ProductSearchSelect";
import { categories, productList, pieColors, getRandomInt, trendDummy } from "./visualizationUtils";

// Add dependencies
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

function formatToDdMmYyyy(date: Date | null | undefined) {
  if (!date) return "";
  const d = date;
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
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

  // Convert ISO string to Date for Shadcn date picker
  const startDateVal = startDate ? new Date(startDate) : undefined;
  const endDateVal = endDate ? new Date(endDate) : undefined;

  return (
    <div className="w-full max-w-3xl mb-10">
      <div className="bg-white/10 rounded-lg p-4 my-3 mb-6 shadow">
        <div className="font-semibold mb-2 text-cosmic-blue text-center">Select up to 10 products:</div>

        {/* Start / End Date - row with Shadcn UI Datepickers */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3">
          {/* Start Date Picker */}
          <div className="flex flex-col items-start gap-1 w-[180px]">
            <label className="text-sm text-cosmic-gold font-semibold">Start Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-between text-left font-normal bg-white text-black"
                >
                  <span>
                    {startDateVal ? formatToDdMmYyyy(startDateVal) : <span className="text-gray-400">Pick a date</span>}
                  </span>
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDateVal}
                  onSelect={date => date ? setStartDate(format(date, "yyyy-MM-dd")) : setStartDate("")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* End Date Picker */}
          <div className="flex flex-col items-start gap-1 w-[180px]">
            <label className="text-sm text-cosmic-gold font-semibold">End Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-between text-left font-normal bg-white text-black"
                >
                  <span>
                    {endDateVal ? formatToDdMmYyyy(endDateVal) : <span className="text-gray-400">Pick a date</span>}
                  </span>
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDateVal}
                  onSelect={date => date ? setEndDate(format(date, "yyyy-MM-dd")) : setEndDate("")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
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
