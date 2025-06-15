
import { Button } from "@/components/ui/button";
import React from "react";
import { StockItem } from "@/hooks/useStockUpdate";

type StockTableProps = {
  data: StockItem[];
  updating: boolean;
  stockRow: number | null;
  input1: string;
  input2: string;
  selectedDate: Date | null;
  startUpdate: (idx: number) => void;
  cancelUpdate: () => void;
  saveUpdate: () => void;
  setInput1: (v: string) => void;
  setInput2: (v: string) => void;
  setStockRow: (idx: number) => void;
};

export default function StockTable({
  data,
  updating,
  stockRow,
  input1,
  input2,
  selectedDate,
  startUpdate,
  cancelUpdate,
  saveUpdate,
  setInput1,
  setInput2,
  setStockRow
}: StockTableProps) {
  return (
    <table className="w-full max-w-xl bg-black/70 rounded shadow text-left border border-cosmic-blue animate-fade-in">
      <thead>
        <tr>
          <th className="px-4 py-2">Stock Item</th>
          <th className="px-4 py-2">Qty</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={row.id}
            className={stockRow === idx && updating ? "bg-yellow-100" : ""}
          >
            <td className="px-4 py-2">{row.item}</td>
            <td className="px-4 py-2">{row.qty}</td>
            <td className="px-4 py-2">
              {updating && (stockRow === idx || stockRow === null) && selectedDate ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={input1}
                    onChange={e => setInput1(e.target.value)}
                    placeholder="Num 1"
                    className="w-16 px-2 py-1 rounded border"
                  />
                  <input
                    type="number"
                    value={input2}
                    onChange={e => setInput2(e.target.value)}
                    placeholder="Num 2"
                    className="w-16 px-2 py-1 rounded border"
                  />
                  <Button
                    variant="outline"
                    onClick={cancelUpdate}
                    className="ml-2"
                  >
                    Cancel
                  </Button>
                  {stockRow !== idx && (
                    <Button
                      variant="ghost"
                      onClick={() => setStockRow(idx)}
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={saveUpdate}
                    className="ml-2"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (selectedDate) {
                      startUpdate(idx);
                    } // else button will be handled by parent dialog logic
                  }}
                  disabled={updating && stockRow !== idx}
                >
                  Update
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
