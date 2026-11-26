import type { VaultNode } from "../../data/types";
import { matchRanges } from "../../lib/search";
import { Chevron, FileIcon, FolderIcon } from "./icons";
import "./TreeNode.css";

export interface TreeNodeProps {
  node: VaultNode;
  depth: number;
  visibleIds: Set<string>;
  expandedSet: Set<string>;
  selectedId: string | null;
  focusedId: string | null;
  query: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
}

export function TreeNode(props: TreeNodeProps) {
  const { node, depth, visibleIds, expandedSet, selectedId, focusedId, query } = props;
  if (!visibleIds.has(node.id)) {
    return null;
  }

  const isFolder = node.type === "folder";
  const hasVisibleChild = node.children?.some((child) => visibleIds.has(child.id)) ?? false;
  const isExpanded = isFolder && (query.trim() ? hasVisibleChild : expandedSet.has(node.id));
  const isSelected = selectedId === node.id;
  const ranges = matchRanges(node.name, query);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    props.onFocus(node.id);
    event.currentTarget.focus();
    if (isFolder) {
      props.onToggle(node.id);
    } else {
      props.onSelect(node.id);
    }
  };

  return (
    <div
      role="treeitem"
      aria-level={depth + 1}
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={focusedId === node.id ? 0 : -1}
      data-node-id={node.id}
      title={node.name}
      className={`tree-item${isSelected ? " tree-item--selected" : ""}`}
      onClick={handleClick}
      onFocus={() => props.onFocus(node.id)}
    >
      <div
        role="none"
        className={`tree-node${isFolder ? " tree-node--folder" : ""}`}
        style={{ paddingLeft: Math.min(depth * 16, 240) }}
      >
        <span className="tree-node__chevron">
          {isFolder ? <Chevron open={isExpanded} /> : null}
        </span>
        <span className="tree-node__icon">
          {isFolder ? <FolderIcon open={isExpanded} /> : <FileIcon />}
        </span>
        <span className="tree-node__name">{renderHighlightedName(node.name, ranges)}</span>
        {!isFolder && node.size && <span className="tree-node__size">{node.size}</span>}
      </div>
      {isFolder && isExpanded && (
        <div role="group">
          {(node.children ?? []).map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              visibleIds={visibleIds}
              expandedSet={expandedSet}
              selectedId={selectedId}
              focusedId={focusedId}
              query={query}
              onToggle={props.onToggle}
              onSelect={props.onSelect}
              onFocus={props.onFocus}
            />
          ))}
          {(!node.children || node.children.length === 0) && (
            <div
              role="presentation"
              className="tree-node__empty"
              style={{ paddingLeft: Math.min((depth + 1) * 16, 240) }}
            >
              Empty folder
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderHighlightedName(name: string, ranges: [number, number][]) {
  if (ranges.length === 0) {
    return name;
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach(([start, end], index) => {
    if (start > cursor) {
      parts.push(<span key={`text-${index}`}>{name.slice(cursor, start)}</span>);
    }
    parts.push(<mark key={`match-${index}`}>{name.slice(start, end)}</mark>);
    cursor = end;
  });

  if (cursor < name.length) {
    parts.push(<span key="tail">{name.slice(cursor)}</span>);
  }

  return parts;
}
