
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchSelectProps {
  allProducts: string[];
  selectedProducts: string[];
  max: number;
  onChange: (products: string[]) => void;
}

export default function ProductSearchSelect({
  allProducts,
  selectedProducts,
  max,
  onChange,
}: ProductSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length === 0) {
      setFiltered([]);
      setDropdownOpen(false);
      return;
    }
    const filteredProducts = allProducts
      .filter(
        (prod) =>
          prod.toLowerCase().includes(query.toLowerCase()) &&
          !selectedProducts.includes(prod)
      )
      .slice(0, 10);
    setFiltered(filteredProducts);
    setDropdownOpen(filteredProducts.length > 0);
  }, [query, selectedProducts, allProducts]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const selectProduct = (product: string) => {
    if (selectedProducts.length < max && !selectedProducts.includes(product)) {
      onChange([...selectedProducts, product]);
    }
    setQuery("");
    setDropdownOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const removeProduct = (product: string) => {
    onChange(selectedProducts.filter((p) => p !== product));
  };

  // Keyboard navigation (optional, simple)
  // Could be improved if needed!

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-stretch relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedProducts.map((prod) => (
          <span
            key={prod}
            className="bg-cosmic-gold/90 text-black rounded px-2 py-1 flex items-center text-xs"
          >
            {prod}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 px-1 py-0.5 text-xs"
              onClick={() => removeProduct(prod)}
              tabIndex={-1}
            >
              ×
            </Button>
          </span>
        ))}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          placeholder={
            selectedProducts.length >= max
              ? "Maximum reached"
              : "Type to search products..."
          }
          autoComplete="off"
          className="pr-3"
          disabled={selectedProducts.length >= max}
          onFocus={() => {
            if (filtered.length > 0) setDropdownOpen(true);
          }}
        />
        {dropdownOpen && filtered.length > 0 && (
          <div className="absolute z-50 bg-background border rounded shadow w-full mt-1 max-h-52 overflow-auto">
            {filtered.map((prod) => (
              <div
                key={prod}
                onClick={() => selectProduct(prod)}
                className="px-3 py-2 hover:bg-cosmic-blue hover:text-black cursor-pointer"
              >
                {prod}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-muted-foreground">No matches</div>
            )}
          </div>
        )}
      </div>
      <div className="text-right text-xs mt-1 text-cosmic-gold">
        {selectedProducts.length} selected / {max} max
      </div>
    </div>
  );
}
