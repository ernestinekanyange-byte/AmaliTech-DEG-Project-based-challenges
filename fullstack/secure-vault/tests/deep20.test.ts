import { describe, expect, it } from "vitest";
import { deriveVisible } from "../src/lib/deriveVisible";
import { makeDeep20 } from "./fixtures/deep20";

describe("deep tree visibility", () => {
  it("lists all nodes in a fully expanded 20-level tree", () => {
    const roots = makeDeep20();
    const expanded = new Set(Array.from({ length: 20 }, (_, level) => `lvl_${level}`));
    const visible = deriveVisible(roots, expanded, "");

    expect(visible).toHaveLength(21);
    expect(visible[0]).toBe("lvl_0");
    expect(visible[20]).toBe("leaf_file");
  });
});
