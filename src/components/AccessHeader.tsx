import React from "react";
import { useNavigate } from "react-router-dom";
import { useSessionAccess } from "@/hooks/useSessionAccess";
import { useSessionRegion } from "@/hooks/useSessionRegion";
import { Button } from "@/components/ui/button";

export default function AccessHeader() {
  const { accessLevel, setLevel } = useSessionAccess();
  const navigate = useNavigate();
  const { region } = useSessionRegion();

  function handleLogout() {
    setLevel("none");
    navigate("/");
  }

  return (
    <header className="flex items-center justify-end w-full px-6 py-3 gap-4 bg-slate-950/80 z-30">
      <span className="text-sm font-semibold text-cosmic-blue">
        Access Level: {accessLevel === "none" ? "None" : accessLevel}
      </span>
      <span className="text-sm font-semibold text-cosmic-gold border-l border-slate-700 pl-3">
        Branch: {region || "None"}
      </span>
      <Button size="sm" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
