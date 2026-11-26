import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "secondary" | "success";
  block?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "secondary",
  block,
  icon,
  children,
  className = "",
  ...rest
}: Props) {
  const classes = [
    "btn",
    variant === "success" && "btn--success",
    block && "btn--block",
    "focus-ring",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
