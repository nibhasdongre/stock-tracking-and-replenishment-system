import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StarBackground from "@/components/StarBackground";

type StockItem = {
  id: number;
  item: string;
  qty: number;
};

export default function CurrentMonthTable() {
  // Initial stock data (simulate loaded from backend)
  const [data, setData] = useState<StockItem[]>([
    { id: 1, item: "Pens", qty: 45 },
    { id: 2, item: "Notebooks", qty: 28 },
    { id: 3, item: "Markers", qty: 10 }
  ]);
  const [updating, setUpdating] = useState(false);
  const [stockRow, setStockRow] = useState<number | null>(null);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const navigate = useNavigate();

  // Enable Save if update UI is showing for any row
  const saveEnabled = updating && stockRow !== null;

  function startUpdate(idx: number) {
    setStockRow(idx);
    setUpdating(true);
    setInput1("");
    setInput2("");
  }
  function cancelUpdate() {
    setStockRow(null);
    setUpdating(false);
    setInput1("");
    setInput2("");
  }
  function saveUpdate() {
    if (stockRow === null) return;
    // For this example: we'll just sum the two numbers entered as new qty
    const num1 = Number(input1);
    const num2 = Number(input2);
    if (isNaN(num1) || isNaN(num2)) {
      alert("Please enter valid numbers.");
      return;
    }
    const updatedQty = num1 + num2;
    setData(prev =>
      prev.map((row, idx) =>
        idx === stockRow ? { ...row, qty: updatedQty } : row
      )
    );
    // TODO: Make API call here to save changes to the backend
    // await fetch("/api/update-stock", { ... })
    cancelUpdate();
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center pt-6 px-2 overflow-hidden">
      <StarBackground />
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => setUpdating(false)}
            disabled={updating}
          >
            Update Stock
          </Button>
          <Button
            variant="secondary"
            onClick={saveUpdate}
            disabled={!saveEnabled}
          >
            Save
          </Button>
          <Button variant="default" onClick={() => navigate("/edit")}>
            Edit Items
          </Button>
        </div>
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
                  {updating && stockRow === idx ? (
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
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => startUpdate(idx)}
                      disabled={updating}
                    >
                      Update
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
