
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccessLevel } from "@/hooks/useSessionAccess";

const ACCESS_PASSWORDS: { [level in Exclude<AccessLevel, "none">]: string } = {
  L1: "l1pass",
  L2: "l2pass",
  L3: "l3pass",
};

type Props = { onSuccess: (level: AccessLevel) => void };

export default function AccessLoginForm({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Infer access level from password, highest privilege takes precedence
    let matchedLevel: AccessLevel | null = null;
    // Check L3 first, then L2, then L1
    if (password === ACCESS_PASSWORDS.L3) matchedLevel = "L3";
    else if (password === ACCESS_PASSWORDS.L2) matchedLevel = "L2";
    else if (password === ACCESS_PASSWORDS.L1) matchedLevel = "L1";

    if (matchedLevel) {
      setError(null);
      onSuccess(matchedLevel);
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <form className="flex flex-col gap-4 items-center w-full" onSubmit={handleSubmit}>
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
