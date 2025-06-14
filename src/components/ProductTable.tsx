
import { useState } from "react";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleProducts = [
  { id: "P123", name: "Thermal Printer", category: "Hardware", stock: 8, minStock: 10 },
  { id: "P124", name: "Barcode Scanner", category: "Hardware", stock: 3, minStock: 8 },
  { id: "P125", name: "A4 Paper", category: "Supplies", stock: 45, minStock: 30 },
];

type Product = typeof sampleProducts[number];

type Props = {
  onDeleteSelection: (ids: string[]) => void;
};

export default function ProductTable({ onDeleteSelection }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    toast({ title: "Deleted", description: `Product ${id} deleted.` });
    onDeleteSelection([id]);
  };

  return (
    <div className="overflow-x-auto rounded-b shadow bg-card">
      <table className="min-w-full">
        <thead className="bg-muted text-muted-foreground text-sm uppercase">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selected.length === sampleProducts.length}
                onChange={() => setSelected(selected.length === sampleProducts.length ? [] : sampleProducts.map(p => p.id))}
                aria-label="Select all"
              />
            </th>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-right">Stock</th>
            <th className="px-4 py-2 text-right">Min</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {sampleProducts.map((prod) => (
            <tr
              key={prod.id}
              className={selected.includes(prod.id) ? "bg-accent/50" : "hover:bg-muted"}
            >
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(prod.id)}
                  onChange={() => handleSelect(prod.id)}
                  aria-label={`Select ${prod.name}`}
                  className="accent-primary"
                />
              </td>
              <td className="px-4 py-2 font-mono">{prod.id}</td>
              <td className="px-4 py-2">{prod.name}</td>
              <td className="px-4 py-2">{prod.category}</td>
              <td className="px-4 py-2 text-right">
                <span className={prod.stock < prod.minStock ? "text-destructive font-semibold" : ""}>
                  {prod.stock}
                </span>
              </td>
              <td className="px-4 py-2 text-right">{prod.minStock}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => handleDelete(prod.id)}
                  title="Delete"
                  className="text-destructive hover:bg-destructive/10 rounded p-2 transition"
                >
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
