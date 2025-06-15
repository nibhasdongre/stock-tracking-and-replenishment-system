
import { useState } from "react";
import { format } from "date-fns";
import { addLogRequest } from "@/utils/logRequests";

export type StockItem = {
  id: number;
  item: string;
  qty: number;
};

type UseStockUpdateParams = {
  initialData: StockItem[];
};

export function useStockUpdate({ initialData }: UseStockUpdateParams) {
  const [data, setData] = useState<StockItem[]>(initialData);
  const [updating, setUpdating] = useState(false);
  const [stockRow, setStockRow] = useState<number | null>(null);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
  function pickDate(date: Date | null) {
    setSelectedDate(date);
    if (date) setUpdating(true);
  }

  return {
    data,
    updating,
    stockRow,
    input1,
    input2,
    selectedDate,
    setStockRow,
    setInput1,
    setInput2,
    setSelectedDate,
    startUpdate,
    cancelUpdate,
    saveUpdate,
    pickDate
  };
}
