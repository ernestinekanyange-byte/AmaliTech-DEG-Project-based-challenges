import { useCallback } from "react";
import { Header } from "./components/layout/Header";
import { TreeView } from "./components/tree/TreeView";
import { SearchInput } from "./components/primitives/SearchInput";
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
        <aside className="properties-placeholder" aria-label="Properties">
          {selected ? selected.name : "Select an item to inspect its properties."}
        </aside>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
