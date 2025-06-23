
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
import { useSessionRegion } from "@/hooks/useSessionRegion";
import StockTable from "@/components/StockTable";
import { useStockUpdate, StockItem } from "@/hooks/useStockUpdate";

// REMOVED: type StockItem = { id: number; item: string; qty: number; }

export default function CurrentMonthTable() {
  const navigate = useNavigate();

  // Intial inventory is static here, could be loaded based on region
  const INITIAL_DATA: StockItem[] = [
    { id: 1, item: "Pens", qty: 45 },
    { id: 2, item: "Notebooks", qty: 28 },
    { id: 3, item: "Markers", qty: 10 }
  ];
  const {
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
    pickDate,
  } = useStockUpdate({ initialData: INITIAL_DATA });

  const [l2Prompt, setL2Prompt] = useState(false);
  const [dateDialog, setDateDialog] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  // Session access logic
  const { accessLevel, setLevel } = useSessionAccess();

  // L2 or L3 required for update
  const canEdit = accessLevel === "L2" || accessLevel === "L3";
  // Enable Save if update UI is showing for any row and date is picked
  const saveEnabled = updating &&  selectedDate !== null;

  // Session region logic
  const { region } = useSessionRegion();

  function handleUpdateButton() {
    // Require L2 or L3 for update
    if (!canEdit) {
      setShowInvalid(true);
      return;
    }
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
      // setUpdating is not directly available; handled inside useStockUpdate when setSelectedDate is called
      setStockRow(null); // Allow user to choose a row after date selection
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center pt-6 px-2 overflow-hidden">
      <StarBackground />
      <AccessHeader />
      <div className="w-full flex flex-row items-center justify-center mb-2 mt-2">
        <div className="bg-cosmic-gold py-1 px-3 rounded text-black font-semibold text-sm shadow border border-cosmic-blue">
          Branch: {region}
        </div>
      </div>
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
        {/* Replace the table here with new StockTable component */}
        <StockTable
          data={data}
          updating={updating}
          stockRow={stockRow}
          input1={input1}
          input2={input2}
          selectedDate={selectedDate}
          startUpdate={startUpdate}
          cancelUpdate={cancelUpdate}
          saveUpdate={saveUpdate}
          setInput1={setInput1}
          setInput2={setInput2}
          setStockRow={setStockRow}
        />
      </div>
    </div>
  );
}
