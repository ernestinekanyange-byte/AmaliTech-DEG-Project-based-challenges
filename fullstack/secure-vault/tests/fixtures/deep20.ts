import type { VaultNode } from "../../src/data/types";

export function makeDeep20(): VaultNode[] {
  let leaf: VaultNode = {
    id: "leaf_file",
    name: "Deep_File.txt",
    type: "file",
    size: "1KB"
  };

  for (let level = 19; level >= 0; level -= 1) {
    leaf = {
      id: `lvl_${level}`,
      name: `Level_${level}`,
      type: "folder",
      children: [leaf]
    };
  }

  return [leaf];
}
