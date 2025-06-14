
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function MonthSelector() {
  const now = new Date();
  const [month, setMonth] = useState<Date | undefined>(now);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-3">
      <h2 className="text-3xl font-bold mb-6">
        {format(now, "MMMM yyyy")}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={() => navigate("/current")}
          className="text-base"
        >
          View Current Month
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/summary")}
          className="text-base"
        >
          Summarize
        </Button>
        <div>
          <Calendar
            mode="single"
            selected={month}
            onSelect={setMonth}
            className="pointer-events-auto p-1"
            onMonthChange={setMonth}
          />
          <Button
            className="mt-2 text-base"
            onClick={() => month && navigate(`/current?month=${encodeURIComponent(format(month, "yyyy-MM"))}`)}
          >
            Choose Month
          </Button>
        </div>
      </div>
    </div>
  );
}
