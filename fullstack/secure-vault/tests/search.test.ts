import { describe, expect, it } from "vitest";
import { matchRanges, anyMatch } from "../src/lib/search";
import type { VaultNode } from "../src/data/types";

describe("matchRanges", () => {
  it("finds multiple occurrences", () => {
    expect(matchRanges("abab", "ab")).toEqual([
      [0, 2],
      [2, 4]
    ]);
  });

  it("matches without regard to case", () => {
    expect(matchRanges("Alpha", "ALP")).toEqual([[0, 3]]);
  });

  it("returns no ranges for a blank query", () => {
    expect(matchRanges("Alpha", "   ")).toEqual([]);
  });
});

describe("anyMatch", () => {
  const tree: VaultNode[] = [
    {
      id: "f",
      name: "F",
      type: "folder",
      children: [{ id: "x", name: "Target.txt", type: "file", size: "1KB" }]
    }
  ];

  it("finds a deep match", () => {
    expect(anyMatch(tree, "target")).toBe(true);
  });

  it("matches an empty query", () => {
    expect(anyMatch(tree, "")).toBe(true);
  });

  it("returns false when no item matches", () => {
    expect(anyMatch(tree, "zzz")).toBe(false);
  });
});
