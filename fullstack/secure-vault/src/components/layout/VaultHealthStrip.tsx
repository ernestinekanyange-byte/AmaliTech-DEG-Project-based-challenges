import { useMemo } from "react";
import type { VaultNode } from "../../data/types";
import { computeTotals, formatBytes } from "../../lib/totals";
import { StatusChip } from "./StatusChip";
import "./VaultHealthStrip.css";

export function VaultHealthStrip({ roots }: { roots: VaultNode[] }) {
  const totals = useMemo(() => computeTotals(roots), [roots]);

  return (
    <footer className="health-strip" aria-label="Vault health">
      <span className="health-strip__item">
        <span className="health-strip__value">{totals.files}</span> files
      </span>
      <span className="health-strip__item">
        <span className="health-strip__value">{totals.folders}</span> folders
      </span>
      <span className="health-strip__item">
        <span className="health-strip__value">{formatBytes(totals.bytes)}</span>
      </span>
      <span className="health-strip__spacer" />
      <StatusChip label="Secure session" />
    </footer>
  );
}
