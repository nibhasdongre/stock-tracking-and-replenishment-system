import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccessLevel } from "@/hooks/useSessionAccess";
import { useSessionRegion, Region } from "@/hooks/useSessionRegion";

const ACCESS_PASSWORDS: { [level in Exclude<AccessLevel, "none">]: string } = {
  L1: "l1pass",
  L2: "l2pass",
  L3: "l3pass",
};

type Props = { onSuccess: (level: AccessLevel) => void };

export default function AccessLoginForm({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>("");
  const { setRegion: saveRegion } = useSessionRegion();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!region) {
      setError("Select a region");
      return;
    }
    // Infer access level from password, highest privilege takes precedence
    let matchedLevel: AccessLevel | null = null;
    // Check L3 first, then L2, then L1
    if (password === ACCESS_PASSWORDS.L3) matchedLevel = "L3";
    else if (password === ACCESS_PASSWORDS.L2) matchedLevel = "L2";
    else if (password === ACCESS_PASSWORDS.L1) matchedLevel = "L1";

    if (matchedLevel) {
      setError(null);
      saveRegion(region);
      onSuccess(matchedLevel);
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <form className="flex flex-col gap-4 items-center w-full" onSubmit={handleSubmit}>
      <label className="w-60 text-center font-medium text-slate-200">
        Select Region (Warehouse):
        <select
          className="w-full mt-2 px-2 py-2 rounded bg-black/40 border border-cosmic-blue text-cosmic-gold"
          value={region}
          required
          onChange={e => setRegion(e.target.value as Region)}
        >
          <option value="">-- Choose Region --</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>
      </label>
      <Input
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter password"
        className="w-60"
        aria-label="Password"
        autoFocus
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-40 mt-2">
        Login
      </Button>
    </form>
  );
}
