import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StarBackground from "@/components/StarBackground";
import PasswordGateL2 from "@/components/PasswordGateL2";
import DateSelectDialog from "@/components/DateSelectDialog";
import { addLogRequest } from "@/utils/logRequests";
import { format } from "date-fns";
import InvalidRequestDialog from "@/components/InvalidRequestDialog";
import AccessHeader from "@/components/AccessHeader";
import { useSessionAccess } from "@/hooks/useSessionAccess";

type StockItem = {
  id: number;
  item: string;
  qty: number;
};

export default function CurrentMonthTable() {
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

  const [l2Prompt, setL2Prompt] = useState(false);
  const [dateDialog, setDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Session access logic
  const { accessLevel, setLevel } = useSessionAccess();
  const [showInvalid, setShowInvalid] = useState(false);

  // L2 or L3 required for update
  const canEdit = accessLevel === "L2" || accessLevel === "L3";
  // Enable Save if update UI is showing for any row and date is picked
  const saveEnabled = updating && stockRow !== null && selectedDate !== null;

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
    setSelectedDate(null);
  }

  function saveUpdate() {
    if (stockRow === null || !selectedDate) return;
    const num1 = Number(input1);
    const num2 = Number(input2);
    if (isNaN(num1) || isNaN(num2)) {
      alert("Please enter valid numbers.");
      return;
    }
    const updatedQty = num1 + num2;
    const today = format(new Date(), "yyyy-MM-dd");
    const picked = format(selectedDate, "yyyy-MM-dd");
    if (picked === today) {
      setData(prev =>
        prev.map((row, idx) =>
          idx === stockRow ? { ...row, qty: updatedQty } : row
        )
      );
      // TODO: Make API call here to save changes to the backend
    } else {
      const item = data[stockRow];
      addLogRequest({
        id: `${Date.now()}_${item.id}`,
        description: `Backdate qty change for ${item.item}`,
        change: `+${updatedQty - item.qty} to ${format(selectedDate, "yyyy-MM-dd")}`,
        status: "pending",
      });
      alert("Your change request has been sent for review (it won't update the data now).");
    }
    cancelUpdate();
  }

  function handleUpdateButton() {
    // Require L2 or L3 for update
    if (!canEdit) {
      setShowInvalid(true);
      return;
    }
    // If already L2 or L3, go directly to date dialog, else prompt for L2
    if (accessLevel === "L2" || accessLevel === "L3") {
      setDateDialog(true);
    } else {
      setL2Prompt(true);
    }
  }

  function handleL2Close(allowed: boolean) {
    setL2Prompt(false);
    if (allowed) {
      setLevel("L2");
      setDateDialog(true); // after unlock, always ask for date
    }
  }
  function handleDateChosen(date: Date | null) {
    setDateDialog(false);
    if (date) {
      setSelectedDate(date);
      setUpdating(true);
      setStockRow(null); // Allow user to choose a row after date selection
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center pt-6 px-2 overflow-hidden">
      <StarBackground />
      <AccessHeader />
      <InvalidRequestDialog open={showInvalid} onOpenChange={setShowInvalid} />
      <PasswordGateL2 open={l2Prompt} onClose={handleL2Close} />
      <DateSelectDialog open={dateDialog} onClose={handleDateChosen} />
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleUpdateButton}
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
          <Button variant="default" onClick={() => canEdit ? navigate("/edit") : setShowInvalid(true)}>
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
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (selectedDate) {
                          setStockRow(idx);
                          setUpdating(true);
                        } else {
                          handleUpdateButton();
                        }
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
      </div>
    </div>
  );
}
