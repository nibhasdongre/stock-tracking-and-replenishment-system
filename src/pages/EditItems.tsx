
import { useState, useEffect } from "react";
import PasswordGate from "@/components/PasswordGate";
import StarBackground from "@/components/StarBackground";
import { Button } from "@/components/ui/button";
import LogRequestsDrawer from "@/components/LogRequestsDrawer";
import ItemFormDialog from "@/components/ItemFormDialog";
import { getLogRequests, setLogRequests, LogRequest } from "@/utils/logRequests";
import InvalidRequestDialog from "@/components/InvalidRequestDialog";
import AccessHeader from "@/components/AccessHeader";
import { useSessionAccess } from "@/hooks/useSessionAccess";
import { useNavigate } from "react-router-dom";

type StockItem = {
  id: number;
  item: string;
  qty: number;
  category: string;
  minStock: number;
};

const initialData: StockItem[] = [
  { id: 1, item: "Pens", qty: 45, category: "Stationery", minStock: 20 },
  { id: 2, item: "Notebooks", qty: 28, category: "Stationery", minStock: 10 },
  { id: 3, item: "Markers", qty: 10, category: "Stationery", minStock: 5 }
];
export default function EditItems() {
  const [data, setData] = useState<StockItem[]>(initialData);
  const [selected, setSelected] = useState<number[]>([]);
  const [logDrawer, setLogDrawer] = useState(false);
  const [logs, setLogs] = useState<LogRequest[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  // Access control
  const { accessLevel, setLevel } = useSessionAccess();
  const [showInvalid, setShowInvalid] = useState(false);
  const navigate = useNavigate();

  // Only allow L3 or above
  useEffect(() => {
    if (accessLevel !== "L3") {
      setShowInvalid(true);
    }
  }, [accessLevel]);

  useEffect(() => {
    // Load logs from localStorage
    setLogs(getLogRequests());
  }, []);
  useEffect(() => {
    setLogRequests(logs);
  }, [logs]);

  function handleAddItem(item: { item: string; qty: number; category: string; minStock: number }) {
    setData(prev => [
      ...prev,
      { ...item, id: prev.length === 0 ? 1 : prev[prev.length - 1].id + 1 }
    ]);
    // TODO: API call to add to DB here
  }

  function handleDelete() {
    if (selected.length === 0) return;
    setData(prev => prev.filter(row => !selected.includes(row.id)));
    setSelected([]);
    // TODO: API call for deleting rows in DB
  }

  function handleApproveLog(id: string) {
    const req = logs.find(l => l.id === id);
    if (!req) return;
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status: "approved" } : l));
    // TODO: Real implementation would update data accordingly
  }
  function handleRejectLog(id: string) {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status: "rejected" } : l));
  }

  function handleSelect(id: number) {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  }

  function handleSave() {
    alert("All changes saved to database!");
  }

  function handleViewRequests() {
    setLogDrawer(true);
  }

  function handleInvalidClose(open: boolean) {
    setShowInvalid(open);
    if (!open) navigate("/");
  }

  return (
    <>
      <StarBackground />
      <AccessHeader />
      <InvalidRequestDialog open={showInvalid} onOpenChange={handleInvalidClose} />
      {accessLevel === "L3" && (
        <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
          <LogRequestsDrawer
            open={logDrawer}
            requests={logs}
            onClose={() => setLogDrawer(false)}
            onApprove={handleApproveLog}
            onReject={handleRejectLog}
          />
          <ItemFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAddItem} />
          <div className="relative z-10 w-full max-w-2xl mx-auto bg-black/70 shadow rounded-xl p-8 border border-cosmic-blue animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-cosmic-blue">Edit Items</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button variant="default" onClick={() => setFormOpen(true)}>Add Item</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={selected.length === 0}>Delete Item{selected.length > 0 && ` (${selected.length})`}</Button>
              <Button variant="outline" onClick={handleViewRequests}>View Requests</Button>
              <Button variant="secondary" onClick={handleSave}>Save</Button>
            </div>
            <table className="w-full bg-black/70 rounded shadow text-left border border-cosmic-blue animate-fade-in">
              <thead>
                <tr>
                  <th className="px-4 py-2">
                    <input type="checkbox"
                      checked={selected.length === data.length && data.length > 0}
                      onChange={() =>
                        setSelected(selected.length === data.length ? [] : data.map(row => row.id))
                      }
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className={selected.includes(row.id) ? "bg-accent/50" : "hover:bg-muted"}>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelect(row.id)}
                      />
                    </td>
                    <td className="px-4 py-2">{row.item}</td>
                    <td className="px-4 py-2">{row.category}</td>
                    <td className="px-4 py-2 text-right">{row.qty}</td>
                    <td className="px-4 py-2 text-right">{row.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
