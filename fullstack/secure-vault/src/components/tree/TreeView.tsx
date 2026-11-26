import { useEffect, useMemo, useRef } from "react";
import type { VaultNode } from "../../data/types";
import { TreeNode } from "./TreeNode";
import "./TreeView.css";

interface Props {
  roots: VaultNode[];
  visibleIds: string[];
  expandedSet: Set<string>;
  selectedId: string | null;
  focusedId: string | null;
  query: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
}

export function TreeView(props: Props) {
  const treeRef = useRef<HTMLDivElement>(null);
  const visibleSet = useMemo(() => new Set(props.visibleIds), [props.visibleIds]);

  useEffect(() => {
    const activeElement = document.activeElement;
    if (
      props.focusedId &&
      activeElement instanceof HTMLElement &&
      activeElement.closest('[role="tree"]') === treeRef.current
    ) {
      treeRef.current
        ?.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(props.focusedId)}"]`)
        ?.focus();
    }
  }, [props.focusedId]);

  return (
    <div
      ref={treeRef}
      role="tree"
      aria-label="Vault file explorer"
      aria-multiselectable={false}
      className="tree-view"
    >
      {props.roots.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          visibleIds={visibleSet}
          expandedSet={props.expandedSet}
          selectedId={props.selectedId}
          focusedId={props.focusedId}
          query={props.query}
          onToggle={props.onToggle}
          onSelect={props.onSelect}
          onFocus={props.onFocus}
        />
      ))}
    </div>
  );
}
