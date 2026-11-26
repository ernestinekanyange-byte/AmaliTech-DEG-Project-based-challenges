import type { VaultIndex, VaultNode } from "../data/types";

export function buildIndex(roots: VaultNode[]): VaultIndex {
  const byId = new Map<string, VaultNode>();
  const parentOf = new Map<string, string | null>();
  const order: string[] = [];

  const walk = (nodes: VaultNode[], parent: string | null) => {
    for (const node of nodes) {
      byId.set(node.id, node);
      parentOf.set(node.id, parent);
      order.push(node.id);
      if (node.type === "folder" && node.children) {
        walk(node.children, node.id);
      }
    }
  };

  walk(roots, null);
  return { byId, parentOf, order };
}
