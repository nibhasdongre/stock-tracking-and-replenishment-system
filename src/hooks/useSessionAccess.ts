
import { useState } from "react";

export type AccessLevel = "none" | "L1" | "L2" | "L3";

const ACCESS_KEY = "session-access-level";

export function useSessionAccess() {
  // Memoize value from sessionStorage (not localStorage for privacy)
  const [access, setAccess] = useState<AccessLevel>(() => {
    const val = sessionStorage.getItem(ACCESS_KEY) as AccessLevel | null;
    return val || "none";
  });

  function setLevel(level: AccessLevel) {
    setAccess(level);
    if (level === "none") {
      sessionStorage.removeItem(ACCESS_KEY);
    } else {
      sessionStorage.setItem(ACCESS_KEY, level);
    }
  }

  return { accessLevel: access, setLevel };
}
