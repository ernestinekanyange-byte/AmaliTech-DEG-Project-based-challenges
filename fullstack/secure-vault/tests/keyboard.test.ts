import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/lib/buildIndex";
import { reconcileFocus, reduceKey } from "../src/lib/keyboard";
import type { VaultNode } from "../src/data/types";

const tree: VaultNode[] = [
  {
    id: "f1",
    name: "Folder1",
    type: "folder",
    children: [{ id: "a", name: "Alpha.txt", type: "file", size: "1KB" }]
  },
  { id: "r", name: "RootFile.txt", type: "file", size: "1KB" }
];

const index = buildIndex(tree);
const visible = ["f1", "a", "r"];
const context = (focusedId: string | null, expandedIds = new Set(["f1"])) => ({
  visibleIds: visible,
  focusedId,
  expandedIds,
  index
});

describe("reduceKey", () => {
  it("moves focus down and clamps at the last row", () => {
    expect(reduceKey("ArrowDown", context("f1"))?.focusedId).toBe("a");
    expect(reduceKey("ArrowDown", context("r"))?.focusedId).toBe("r");
  });

  it("moves focus up and clamps at the first row", () => {
    expect(reduceKey("ArrowUp", context("a"))?.focusedId).toBe("f1");
    expect(reduceKey("ArrowUp", context("f1"))?.focusedId).toBe("f1");
  });

  it("expands a collapsed folder", () => {
    expect(reduceKey("ArrowRight", context("f1", new Set()))?.expandedIds?.has("f1")).toBe(
      true
    );
  });

  it("moves to the first child of an expanded folder", () => {
    expect(reduceKey("ArrowRight", context("f1"))?.focusedId).toBe("a");
  });

  it("does nothing when expanding a file", () => {
    expect(reduceKey("ArrowRight", context("a"))).toBeNull();
  });

  it("collapses a folder without changing selection", () => {
    const result = reduceKey("ArrowLeft", context("f1"));
    expect(result?.expandedIds?.has("f1")).toBe(false);
    expect(result?.focusedId).toBeUndefined();
  });

  it("moves from a child to its visible parent", () => {
    expect(reduceKey("ArrowLeft", context("a"))?.focusedId).toBe("f1");
  });

  it("navigates through search-expanded folders without changing expansion state", () => {
    const expandedIds = new Set<string>();
    const searchContext = {
      ...context("f1", expandedIds),
      searchActive: true
    };

    expect(reduceKey("ArrowRight", searchContext)?.focusedId).toBe("a");
    expect(reduceKey("ArrowLeft", { ...searchContext, focusedId: "a" })?.focusedId).toBe("f1");
    expect(expandedIds.size).toBe(0);
  });

  it("moves to the first and last visible rows", () => {
    expect(reduceKey("Home", context("r"))?.focusedId).toBe("f1");
    expect(reduceKey("End", context("f1"))?.focusedId).toBe("r");
  });
});

describe("reconcileFocus", () => {
  it("keeps the focused item while it remains visible", () => {
    expect(reconcileFocus(["a", "b"], "b")).toBe("b");
  });

  it("moves focus to the first result when the current item is hidden", () => {
    expect(reconcileFocus(["a", "b"], "hidden")).toBe("a");
  });

  it("clears focus when no rows are visible", () => {
    expect(reconcileFocus([], "hidden")).toBeNull();
  });
});
