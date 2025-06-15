
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccessLevel } from "@/hooks/useSessionAccess";

const ACCESS_PASSWORDS: Record<AccessLevel, string> = {
  none: "",
  L1: "l1pass",
  L2: "l2pass",
  L3: "l3pass",
};

type Props = { onSuccess: (level: AccessLevel) => void };

export default function AccessLoginForm({ onSuccess }: Props) {
  const [access, setAccess] = useState<AccessLevel>("L1");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password === ACCESS_PASSWORDS[access]) {
      setError(null);
      onSuccess(access);
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <form className="flex flex-col gap-4 items-center w-full" onSubmit={handleSubmit}>
      <div className="flex gap-4 mb-1">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="access"
            value="L1"
            checked={access === "L1"}
            onChange={() => setAccess("L1")}
            className="accent-cosmic-blue"
          />
          View Only (L1)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="access"
            value="L2"
            checked={access === "L2"}
            onChange={() => setAccess("L2")}
            className="accent-cosmic-cyan"
          />
          Update (L2)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="access"
            value="L3"
            checked={access === "L3"}
            onChange={() => setAccess("L3")}
            className="accent-cosmic-gold"
          />
          Admin (L3)
        </label>
      </div>
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
