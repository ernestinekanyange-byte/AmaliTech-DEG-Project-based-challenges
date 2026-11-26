import type { VaultIndex } from "../data/types";

export interface KeyContext {
  visibleIds: string[];
  focusedId: string | null;
  expandedIds: Set<string>;
  index: VaultIndex;
}

export interface KeyResult {
  focusedId?: string | null;
  expandedIds?: Set<string>;
}

export function reduceKey(key: string, context: KeyContext): KeyResult | null {
  const { visibleIds, focusedId, expandedIds, index } = context;
  const currentIndex = focusedId ? visibleIds.indexOf(focusedId) : -1;

  switch (key) {
    case "ArrowDown": {
      if (visibleIds.length === 0) {
        return null;
      }
      const nextIndex =
        currentIndex === -1 ? 0 : Math.min(currentIndex + 1, visibleIds.length - 1);
      return { focusedId: visibleIds[nextIndex] };
    }
    case "ArrowUp": {
      if (visibleIds.length === 0) {
        return null;
      }
      const nextIndex = currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0);
      return { focusedId: visibleIds[nextIndex] };
    }
    case "ArrowRight": {
      if (!focusedId) {
        return null;
      }
      const node = index.byId.get(focusedId);
      if (!node || node.type !== "folder") {
        return null;
      }
      if (!expandedIds.has(focusedId)) {
        const nextExpanded = new Set(expandedIds);
        nextExpanded.add(focusedId);
        return { expandedIds: nextExpanded };
      }
      const firstVisibleChild = (node.children ?? []).find((child) =>
        visibleIds.includes(child.id)
      );
      return firstVisibleChild ? { focusedId: firstVisibleChild.id } : null;
    }
    case "ArrowLeft": {
      if (!focusedId) {
        return null;
      }
      const node = index.byId.get(focusedId);
      if (node?.type === "folder" && expandedIds.has(focusedId)) {
        const nextExpanded = new Set(expandedIds);
        nextExpanded.delete(focusedId);
        return { expandedIds: nextExpanded };
      }
      const parent = index.parentOf.get(focusedId) ?? null;
      return parent && visibleIds.includes(parent) ? { focusedId: parent } : null;
    }
    case "Home":
      return visibleIds.length ? { focusedId: visibleIds[0] } : null;
    case "End":
      return visibleIds.length ? { focusedId: visibleIds[visibleIds.length - 1] } : null;
    default:
      return null;
  }
}
