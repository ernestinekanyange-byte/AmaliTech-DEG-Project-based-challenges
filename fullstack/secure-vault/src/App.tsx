import { useCallback, useMemo } from "react";
import { Header } from "./components/layout/Header";
import { VaultHealthStrip } from "./components/layout/VaultHealthStrip";
import { PropertiesPanel } from "./components/properties/PropertiesPanel";
import { TreeView } from "./components/tree/TreeView";
import { SearchInput } from "./components/primitives/SearchInput";
import type { VaultNode } from "./data/types";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import { useVault } from "./hooks/useVault";
import "./App.css";

export default function App() {
  const vault = useVault();
  const {
    index,
    expandedIds,
    selectedId,
    focusedId,
    query,
    visibleIds,
    setExpandedIds,
    setFocusedId,
    setQuery,
    toggle,
    select
  } = vault;

  const setKeyExpandedIds = useCallback(
    (ids: Set<string>) => setExpandedIds(ids),
    [setExpandedIds]
  );
  const selected = selectedId ? index.byId.get(selectedId) ?? null : null;
  const path = useMemo<VaultNode[]>(() => {
    if (!selectedId) {
      return [];
    }

    const nodes: VaultNode[] = [];
    let currentId: string | null = selectedId;
    while (currentId) {
      const node = index.byId.get(currentId);
      if (node) {
        nodes.unshift(node);
      }
      currentId = index.parentOf.get(currentId) ?? null;
    }
    return nodes;
  }, [selectedId, index]);

  useKeyboardNav({
    visibleIds,
    focusedId,
    expandedIds,
    index,
    onFocus: setFocusedId,
    onExpand: setKeyExpandedIds,
    onSelect: select,
    onClearSearch: () => setQuery(""),
    query
  });

  const announce = selected
    ? `Selected: ${selected.name}${selected.type === "file" && selected.size ? `, ${selected.size}` : ""}`
    : "";

  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <main className="tree-pane">
          <div className="tree-pane__heading">
            <div>
              <p className="tree-pane__eyebrow">Enterprise vault</p>
              <h1>File Explorer</h1>
            </div>
            <span className="tree-pane__count">{index.order.length} items</span>
          </div>
          <SearchInput value={query} onChange={setQuery} />
          <div className="tree-pane__scroll">
            {visibleIds.length === 0 ? (
              <div className="tree-pane__empty">
                <span>No items match “{query}”.</span>
                <button className="focus-ring" type="button" onClick={() => setQuery("")}>
                  Clear search
                </button>
              </div>
            ) : (
              <TreeView
                roots={vault.roots}
                visibleIds={visibleIds}
                expandedSet={expandedIds}
                selectedId={selectedId}
                focusedId={focusedId}
                query={query}
                onToggle={toggle}
                onSelect={select}
                onFocus={setFocusedId}
              />
            )}
          </div>
        </main>
        <PropertiesPanel selected={selected} path={path} />
      </div>
      <VaultHealthStrip roots={vault.roots} />
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
