
import React from "react";

type Product = {
  name: string;
  value: number;
};

type SummaryMatrixProps = {
  topQuantity: Product[];
  bottomQuantity: Product[];
  topSales: Product[];
  bottomSales: Product[];
};

export default function SummaryMatrix({
  topQuantity,
  bottomQuantity,
  topSales,
  bottomSales,
}: SummaryMatrixProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Quantity column */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 bg-opacity-70 border border-cosmic-blue rounded-xl p-4 shadow cursor-pointer hover:ring-2 ring-cosmic-blue transition">
          <div className="font-bold text-cosmic-blue text-lg mb-2 text-center">Top 5 Products (Quantity)</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-200">
            {topQuantity.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span className="truncate">{item.name}</span>
                <span className="font-semibold pl-3">{item.value}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-slate-900 bg-opacity-70 border border-cosmic-blue rounded-xl p-4 shadow cursor-pointer hover:ring-2 ring-cosmic-blue transition">
          <div className="font-bold text-cosmic-blue text-lg mb-2 text-center">Bottom 5 Products (Quantity)</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-200">
            {bottomQuantity.map((item, i) => (
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
        <div className="bg-slate-900 bg-opacity-70 border border-cosmic-gold rounded-xl p-4 shadow cursor-pointer hover:ring-2 ring-cosmic-gold transition">
          <div className="font-bold text-cosmic-gold text-lg mb-2 text-center">Top 5 Products (Sales)</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-200">
            {topSales.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span className="truncate">{item.name}</span>
                <span className="font-semibold pl-3">{item.value}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-slate-900 bg-opacity-70 border border-cosmic-gold rounded-xl p-4 shadow cursor-pointer hover:ring-2 ring-cosmic-gold transition">
          <div className="font-bold text-cosmic-gold text-lg mb-2 text-center">Bottom 5 Products (Sales)</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-200">
            {bottomSales.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span className="truncate">{item.name}</span>
                <span className="font-semibold pl-3">{item.value}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
