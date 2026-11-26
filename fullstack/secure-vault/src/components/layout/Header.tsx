import { StatusChip } from "./StatusChip";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <svg
          className="header__shield"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        </svg>
        SecureVault
      </div>
      <StatusChip label="AES-256 · Encrypted" />
    </header>
  );
}
