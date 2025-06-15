
import React from "react";

type Product = {
  name: string;
  value: number;
};

type CompactTopBottomTableProps = {
  topQuantity: Product[];
  bottomQuantity: Product[];
  topSales: Product[];
  bottomSales: Product[];
};

const CompactTopBottomTable = React.forwardRef<HTMLDivElement, CompactTopBottomTableProps>(
  ({ topQuantity, bottomQuantity, topSales, bottomSales }, ref) => (
    <div ref={ref} className="p-3">
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <div>
          <div className="text-cosmic-blue font-semibold text-base text-center mb-1">
            Top 5 (Quantity)
          </div>
          <table className="w-full border text-xs bg-white text-black rounded mb-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {topQuantity.map((p) => (
                <tr key={p.name}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1 text-center">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-cosmic-blue font-semibold text-base text-center mb-1 mt-3">
            Bottom 5 (Quantity)
          </div>
          <table className="w-full border text-xs bg-white text-black rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {bottomQuantity.map((p) => (
                <tr key={p.name}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1 text-center">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-cosmic-gold font-semibold text-base text-center mb-1">
            Top 5 (Sales)
          </div>
          <table className="w-full border text-xs bg-white text-black rounded mb-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topSales.map((p) => (
                <tr key={p.name}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1 text-center">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-cosmic-gold font-semibold text-base text-center mb-1 mt-3">
            Bottom 5 (Sales)
          </div>
          <table className="w-full border text-xs bg-white text-black rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Sales</th>
              </tr>
            </thead>
            <tbody>
              {bottomSales.map((p) => (
                <tr key={p.name}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1 text-center">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
);

export default CompactTopBottomTable;
