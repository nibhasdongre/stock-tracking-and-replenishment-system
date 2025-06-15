
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type DateSelectDialogProps = {
  open: boolean;
  onClose: (date: Date | null) => void;
};

export default function DateSelectDialog({ open, onClose }: DateSelectDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDate) {
      onClose(selectedDate);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="pointer-events-auto p-3" />
          <DialogFooter>
            <Button type="submit" disabled={!selectedDate}>Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
