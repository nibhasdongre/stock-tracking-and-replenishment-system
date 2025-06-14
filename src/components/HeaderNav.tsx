
import { Table, ChartBar, Mail, Plus, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Inventory", icon: Table, path: "/" },
  { name: "Dashboard", icon: ChartBar, path: "/dashboard" },
  { name: "Emails", icon: Mail, path: "/emails" },
];

export default function HeaderNav() {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between mx-auto max-w-screen-2xl px-6 py-2">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tight text-primary pr-8">StockTracker</span>
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded transition-colors hover:bg-muted",
                pathname === link.path ? "bg-accent font-semibold text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="hover-scale text-primary bg-accent px-3 py-1.5 rounded font-medium flex items-center gap-2"
            title="Add New Product"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>
    </nav>
  );
}
