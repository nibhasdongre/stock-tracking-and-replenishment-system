
import React from "react";

type SummaryTableProps = {
  tableTitle: string;
  tableData: { name: string; quantity: number; sales: number }[];
  summaryTableRef?: React.Ref<HTMLDivElement>;
};

const SummaryTable: React.FC<SummaryTableProps> = ({ tableTitle, tableData, summaryTableRef }) => (
  <div ref={summaryTableRef}>
    <h3 className="text-center text-lg font-bold text-cosmic-gold mb-2">{tableTitle}</h3>
    <table className="w-full border text-slate-100 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-cosmic-blue text-black">
          <th className="p-2">Product</th>
          <th className="p-2">Quantity</th>
          <th className="p-2">Sales</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, i) => (
          <tr key={i} className="bg-black/70 border-b last:border-0">
            <td className="p-2">{row.name}</td>
            <td className="p-2 text-center">{row.quantity}</td>
            <td className="p-2 text-center">{row.sales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SummaryTable;
