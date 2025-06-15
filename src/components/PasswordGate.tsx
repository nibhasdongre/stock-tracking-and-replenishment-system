
import React, { useState, useEffect } from "react";

type PasswordGateProps = {
  gateId: string; // unique to each page
  password: string;
  children: React.ReactNode;
};

export default function PasswordGate({ gateId, password, children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [entered, setEntered] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`gate-unlocked:${gateId}`);
    if (stored === "yes") setUnlocked(true);
  }, [gateId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (entered === password) {
      localStorage.setItem(`gate-unlocked:${gateId}`, "yes");
      setUnlocked(true);
    } else {
      setError("Incorrect password.");
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <form
        className="bg-black/80 border border-cosmic-blue shadow-xl rounded-xl px-5 py-10 flex flex-col gap-4 items-center max-w-xs mx-auto"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-cosmic-blue text-2xl font-bold mb-2">Password Required</h2>
        <input
          type="password"
          value={entered}
          onChange={e => {
            setEntered(e.target.value);
            setError("");
          }}
          className="rounded px-4 py-2 border w-60 shadow text-base"
          placeholder="Enter password"
          aria-label="Password"
        />
        {error && <div className="text-destructive text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-cosmic-blue text-cosmic-gold px-5 py-2 rounded shadow font-semibold hover:bg-cosmic-gold hover:text-black"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
