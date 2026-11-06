import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex-center" style={{ height: "60vh", flexDirection: "column", gap: 16 }}>
      <Loader2 size={44} strokeWidth={2} className="page-spinner" style={{ color: "var(--color-primary)" }} />
      <span style={{ color: "var(--color-gray)", fontSize: 15, fontWeight: 500 }}>Loading…</span>
    </div>
  );
};

export default Loader;
