import "./StatusChip.css";

export function StatusChip({ label }: { label: string }) {
  return (
    <span className="status-chip">
      <span className="status-chip__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
