
import React, { useState, useEffect } from "react";

type PasswordGateL2Props = {
  gateId?: string;
  password?: string;
  open: boolean;
  onClose: (allowed: boolean) => void;
};

export default function PasswordGateL2({
  gateId = "l2-access",
  password = "starsl2",
  open,
  onClose,
}: PasswordGateL2Props) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setEntered("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (entered === password) {
      localStorage.setItem(`gate-unlocked:${gateId}`, "yes");
      onClose(true);
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        className="bg-black/80 border border-cosmic-blue shadow-xl rounded-xl px-6 py-9 flex flex-col gap-4 items-center max-w-xs mx-auto"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-cosmic-blue text-2xl font-bold mb-2">L2 Password Required</h2>
        <input
          type="password"
          value={entered}
          onChange={e => {
            setEntered(e.target.value);
            setError("");
          }}
          className="rounded px-4 py-2 border w-56 shadow text-base"
          placeholder="Enter L2 password"
          aria-label="L2 Password"
        />
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div className="flex w-full gap-2">
          <button
            type="submit"
            className="w-1/2 bg-cosmic-blue text-cosmic-gold px-4 py-2 rounded shadow font-semibold hover:bg-cosmic-gold hover:text-black"
          >
            Unlock
          </button>
          <button
            type="button"
            className="w-1/2 bg-muted text-cosmic-blue px-4 py-2 rounded shadow font-semibold hover:bg-white"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
