import { useEffect } from "react";
import type { VaultIndex } from "../data/types";
import { reduceKey } from "../lib/keyboard";

interface Params {
  visibleIds: string[];
  focusedId: string | null;
  expandedIds: Set<string>;
  index: VaultIndex;
  onFocus: (id: string | null) => void;
  onExpand: (ids: Set<string>) => void;
  onSelect: (id: string) => void;
  onClearSearch: () => void;
  query: string;
}

export function useKeyboardNav(params: Params) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (event.key === "Escape") {
        if (params.query) {
          event.preventDefault();
          params.onClearSearch();
        }
        return;
      }

      if (!target.closest('[role="tree"]')) {
        return;
      }

      if (event.key === "Enter") {
        if (params.focusedId) {
          event.preventDefault();
          params.onSelect(params.focusedId);
        }
        return;
      }

      const result = reduceKey(event.key, {
        visibleIds: params.visibleIds,
        focusedId: params.focusedId,
        expandedIds: params.expandedIds,
        index: params.index,
        searchActive: Boolean(params.query.trim())
      });

      if (!result) {
        return;
      }

      event.preventDefault();
      if (result.focusedId !== undefined) {
        params.onFocus(result.focusedId);
      }
      if (result.expandedIds !== undefined) {
        params.onExpand(result.expandedIds);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [params]);
}
