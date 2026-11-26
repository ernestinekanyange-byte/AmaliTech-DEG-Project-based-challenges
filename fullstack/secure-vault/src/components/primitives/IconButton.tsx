import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, className = "", ...rest }: Props) {
  return (
    <button className={`icon-btn focus-ring ${className}`} {...rest}>
      {children}
    </button>
  );
}
