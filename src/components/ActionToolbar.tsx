
import { Plus, Trash, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onAdd: () => void;
  onDelete: () => void;
  onSendEmail: () => void;
  selectedCount: number;
};

export default function ActionToolbar({ onAdd, onDelete, onSendEmail, selectedCount }: Props) {
  return (
    <div className="flex gap-4 p-2 bg-muted border-b rounded-t items-center">
      <button
        className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded hover:scale-105 transition"
        onClick={onAdd}
      >
        <Plus size={18} />
        Add Product
      </button>
      <button
        disabled={selectedCount === 0}
        className="flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-1.5 rounded hover:scale-105 transition disabled:opacity-50"
        onClick={onDelete}
      >
        <Trash size={18} />
        Delete
      </button>
      <button
        className="flex items-center gap-1 bg-accent text-primary px-3 py-1.5 rounded hover:scale-105 transition"
        onClick={onSendEmail}
      >
        <Mail size={18} />
        Send Replenishment Email
      </button>
      <span className="ml-auto text-sm text-muted-foreground font-medium">{selectedCount} selected</span>
    </div>
  );
}
