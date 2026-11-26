import { describe, expect, it } from "vitest";
import { computeTotals, formatBytes, parseSize } from "../src/lib/totals";
import type { VaultNode } from "../src/data/types";

describe("parseSize", () => {
  it("parses supported size units", () => {
    expect(parseSize("1KB")).toBe(1024);
    expect(parseSize("4.2MB")).toBeCloseTo(4.2 * 1024 ** 2);
    expect(parseSize("1GB")).toBe(1024 ** 3);
  });

  it("returns zero for missing or invalid values", () => {
    expect(parseSize(undefined)).toBe(0);
    expect(parseSize("n/a")).toBe(0);
    expect(parseSize("Infinity GB")).toBe(0);
  });
});

describe("formatBytes", () => {
  it("formats byte totals compactly", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toMatch(/1(\.0)? KB/);
    expect(formatBytes(4.2 * 1024 ** 2)).toMatch(/4\.2 MB/);
  });
});

describe("computeTotals", () => {
  const tree: VaultNode[] = [
    {
      id: "f",
      name: "F",
      type: "folder",
      children: [
        { id: "x", name: "X", type: "file", size: "1KB" },
        { id: "y", name: "Y", type: "file", size: "1KB" }
      ]
    },
    { id: "z", name: "Z", type: "file", size: "1KB" }
  ];

  it("counts nested folders, files, and bytes", () => {
    expect(computeTotals(tree)).toEqual({ files: 3, folders: 1, bytes: 3 * 1024 });
  });
});
