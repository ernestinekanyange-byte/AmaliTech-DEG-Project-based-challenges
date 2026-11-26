import { useCallback, useEffect, useMemo, useState } from "react";
import rawData from "../../data.json";
import type { VaultNode } from "../data/types";
import { buildIndex } from "../lib/buildIndex";
import { deriveVisible } from "../lib/deriveVisible";
import { reconcileFocus } from "../lib/keyboard";

const roots = rawData as VaultNode[];

export function useVault() {
  const index = useMemo(() => buildIndex(roots), []);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(["root_1", "leg_1", "case_a"])
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>("root_1");
  const [query, setQuery] = useState("");

  const visibleIds = useMemo(
    () => deriveVisible(roots, expandedIds, query),
    [expandedIds, query]
  );
  const visibleFocusedId = reconcileFocus(visibleIds, focusedId);

  useEffect(() => {
    setFocusedId((current) => reconcileFocus(visibleIds, current));
  }, [visibleIds]);

  const toggle = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const select = useCallback((id: string) => setSelectedId(id), []);

  return {
    roots,
    index,
    expandedIds,
    selectedId,
    focusedId: visibleFocusedId,
    query,
    visibleIds,
    setExpandedIds,
    setFocusedId,
    setQuery,
    toggle,
    select
  };
}
