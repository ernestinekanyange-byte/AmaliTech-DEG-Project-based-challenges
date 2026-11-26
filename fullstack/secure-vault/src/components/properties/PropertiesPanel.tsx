import { useState } from "react";
import type { VaultNode } from "../../data/types";
import { childCount } from "../../lib/totals";
import { Button } from "../primitives/Button";
import { Breadcrumb } from "./Breadcrumb";
import "./PropertiesPanel.css";

interface Props {
  selected: VaultNode | null;
  path: VaultNode[];
}

type CopyState = "idle" | "copied" | "error";

export function PropertiesPanel({ selected, path }: Props) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyPath = async () => {
    setCopyState("idle");
    if (!navigator.clipboard?.writeText) {
      setCopyState("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(path.map((node) => node.name).join(" / "));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  if (!selected) {
    return (
      <aside className="properties" aria-label="Properties">
        <div className="properties__empty">
          <svg
            width="40"
            height="40"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M4 1.5h5l3 3v10H4v-13zm5 0v3h3" />
          </svg>
          <span>Select a file or folder to inspect its properties.</span>
        </div>
      </aside>
    );
  }

  const isFolder = selected.type === "folder";

  return (
    <aside className="properties" aria-label="Properties">
      <Breadcrumb path={path} onCopy={copyPath} />
      <h2 className="properties__title">{selected.name}</h2>
      <hr className="properties__divider" />
      <div className="properties__rows">
        <div className="properties__row">
          <span className="properties__label">Type</span>
          <span className="properties__value">{isFolder ? "Folder" : "File"}</span>
        </div>
        <div className="properties__row">
          <span className="properties__label">{isFolder ? "Items" : "Size"}</span>
          <span className="properties__value">
            {isFolder ? childCount(selected) : selected.size ?? "—"}
          </span>
        </div>
      </div>
      <div className="properties__spacer" />
      <p
        className={`properties__copy-status${copyState === "error" ? " properties__copy-status--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {copyState === "copied"
          ? "Path copied."
          : copyState === "error"
            ? "Could not copy the path. Copy it manually."
            : ""}
      </p>
      <Button block variant={copyState === "copied" ? "success" : "secondary"} onClick={copyPath}>
        {copyState === "copied" ? "Copied" : "Copy path"}
      </Button>
    </aside>
  );
}
