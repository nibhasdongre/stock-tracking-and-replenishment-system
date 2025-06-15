
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type InvalidRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InvalidRequestDialog({ open, onOpenChange }: InvalidRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invalid Request</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Invalid request
        </DialogDescription>
        <DialogFooter className="justify-center">
          <DialogClose asChild>
            <Button variant="secondary">
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
