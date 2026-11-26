import type { VaultNode } from "../../data/types";
import "./Breadcrumb.css";

interface Props {
  path: VaultNode[];
  onCopy: () => void;
}

export function Breadcrumb({ path, onCopy }: Props) {
  if (path.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumb">
      <nav className="breadcrumb__nav" aria-label="File path">
        {path.map((node, index) => (
          <span key={node.id}>
            {index > 0 && <span className="breadcrumb__sep"> / </span>}
            <span className={index === path.length - 1 ? "breadcrumb__current" : ""}>
              {node.name}
            </span>
          </span>
        ))}
      </nav>
      <button
        className="breadcrumb__copy focus-ring"
        type="button"
        onClick={onCopy}
        aria-label="Copy full path"
      >
        Copy
      </button>
    </div>
  );
}
