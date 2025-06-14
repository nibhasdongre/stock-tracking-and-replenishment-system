
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CurrentMonthTable() {
  const [updating, setUpdating] = useState(false);
  const [stockRow, setStockRow] = useState<number | null>(null);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Demo data (replace with real from backend)
  const data = [
    { id: 1, item: "Pens", qty: 45 },
    { id: 2, item: "Notebooks", qty: 28 },
    { id: 3, item: "Markers", qty: 10 }
  ];

  function startUpdate(idx: number) {
    setStockRow(idx);
    setUpdating(true);
  }
  function cancelUpdate() {
    setStockRow(null);
    setUpdating(false);
    setInput1("");
    setInput2("");
  }
  function saveUpdate() {
    // Simulate saving: in real app, API call here
    cancelUpdate();
    alert("Changes saved (simulation).");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-6 px-2">
      <div className="flex gap-3 mb-6">
        <Button variant="outline" onClick={() => setUpdating(false)}>
          Update Stock
        </Button>
        <Button variant="secondary" onClick={saveUpdate} disabled={!updating}>
          Save
        </Button>
        <Button variant="default" onClick={() => navigate("/edit")}>
          Edit Items
        </Button>
      </div>
      <table className="w-full max-w-xl bg-card rounded shadow text-left border">
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
              className={stockRow === idx ? "bg-yellow-100" : ""}
            >
              <td className="px-4 py-2">{row.item}</td>
              <td className="px-4 py-2">{row.qty}</td>
              <td className="px-4 py-2">
                {updating && stockRow === idx && (
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
                  </div>
                )}
                {!updating && (
                  <Button
                    variant="ghost"
                    onClick={() => startUpdate(idx)}
                  >
                    Update
                  </Button>
                )}
                {updating && stockRow === idx && (
                  <Button variant="outline" onClick={cancelUpdate} className="ml-2">
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
