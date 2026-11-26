import { describe, expect, it } from "vitest";
import { deriveVisible } from "../src/lib/deriveVisible";
import type { VaultNode } from "../src/data/types";

const tree: VaultNode[] = [
  {
    id: "f1",
    name: "Folder1",
    type: "folder",
    children: [
      { id: "a", name: "Alpha.txt", type: "file", size: "1KB" },
      {
        id: "sub",
        name: "Sub",
        type: "folder",
        children: [{ id: "b", name: "Beta.pdf", type: "file", size: "2KB" }]
      }
    ]
  },
  { id: "r", name: "RootFile.txt", type: "file", size: "1KB" },
  { id: "empty", name: "Empty", type: "folder", children: [] }
];

describe("deriveVisible", () => {
  it("lists roots when nothing is expanded", () => {
    expect(deriveVisible(tree, new Set(), "")).toEqual(["f1", "r", "empty"]);
  });

  it("expands one level", () => {
    expect(deriveVisible(tree, new Set(["f1"]), "")).toEqual([
      "f1",
      "a",
      "sub",
      "r",
      "empty"
    ]);
  });

  it("expands recursively", () => {
    expect(deriveVisible(tree, new Set(["f1", "sub"]), "")).toEqual([
      "f1",
      "a",
      "sub",
      "b",
      "r",
      "empty"
    ]);
  });

  it("shows only matches and their ancestors without changing expansion state", () => {
    const collapsed = new Set<string>();
    expect(deriveVisible(tree, collapsed, "beta")).toEqual(["f1", "sub", "b"]);
    expect(collapsed.size).toBe(0);
  });

  it("does not show unrelated children when a folder name matches", () => {
    expect(deriveVisible(tree, new Set(["f1"]), "folder1")).toEqual(["f1"]);
  });
});
