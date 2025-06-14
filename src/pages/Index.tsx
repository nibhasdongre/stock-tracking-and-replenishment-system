
import { useState } from "react";
import HeaderNav from "@/components/HeaderNav";
import DashboardCards from "@/components/DashboardCards";
import ProductTable from "@/components/ProductTable";
import ActionToolbar from "@/components/ActionToolbar";
import { useNavigate } from "react-router-dom";
import StarBackground from "@/components/StarBackground";

export default function Index() {
  const [selection, setSelection] = useState<string[]>([]);
  const navigate = useNavigate();

  function handleAdd() {
    // Open add modal (to be implemented)
    alert("Add Product modal coming soon!");
  }

  function handleDelete() {
    if (selection.length === 0) return;
    alert(`Delete: ${selection.join(", ")}`);
    setSelection([]);
  }

  function handleSendEmail() {
    alert("Replenishment emails sent (soon)!");
  }

  function onDeleteSelection(ids: string[]) {
    setSelection((sel) => sel.filter((sid) => !ids.includes(sid)));
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <StarBackground />
      <HeaderNav />
      <main className="max-w-screen-2xl mx-auto px-6 pt-8 pb-20 animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-cosmic-blue">
          Inventory & Stock
        </h2>
        <DashboardCards />
        <section className="bg-black/70 rounded-lg shadow border border-cosmic-blue">
          <ActionToolbar
            onAdd={handleAdd}
            onDelete={handleDelete}
            onSendEmail={handleSendEmail}
            selectedCount={selection.length}
          />
          <ProductTable onDeleteSelection={onDeleteSelection} />
        </section>
      </main>
    </div>
  );
}
