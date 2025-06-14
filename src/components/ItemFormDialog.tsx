
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ItemFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: { item: string; qty: number; category: string; minStock: number }) => void;
};

export default function ItemFormDialog({ open, onClose, onSubmit }: ItemFormDialogProps) {
  const [item, setItem] = React.useState("");
  const [qty, setQty] = React.useState<number>(0);
  const [category, setCategory] = React.useState("");
  const [minStock, setMinStock] = React.useState<number>(0);

  function handleSave() {
    if (!item || qty < 0 || minStock < 0) return;
    onSubmit({ item, qty, category, minStock });
    setItem("");
    setQty(0);
    setCategory("");
    setMinStock(0);
    onClose();
  }

  function handleClose() {
    setItem("");
    setQty(0);
    setCategory("");
    setMinStock(0);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-3"
        >
          <Input value={item} onChange={e => setItem(e.target.value)} placeholder="Item name" required />
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
          <Input type="number" value={qty} onChange={e => setQty(parseInt(e.target.value) || 0)} placeholder="Quantity" min={0} required />
          <Input type="number" value={minStock} onChange={e => setMinStock(parseInt(e.target.value) || 0)} placeholder="Min Stock" min={0} required />
          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
            <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
