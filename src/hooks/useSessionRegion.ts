
import { useState } from "react";

export type Region = "North" | "South" | "East" | "West" | "";

const REGION_KEY = "session-region";

export function useSessionRegion() {
  const [region, setRegionState] = useState<Region>(() => {
    const val = sessionStorage.getItem(REGION_KEY) as Region | null;
    return val || "";
  });

  function setRegion(r: Region) {
    setRegionState(r);
    if (!r) {
      sessionStorage.removeItem(REGION_KEY);
    } else {
      sessionStorage.setItem(REGION_KEY, r);
    }
  }

  return { region, setRegion };
}
