import type { VaultNode } from "../data/types";

export function deriveVisible(
  roots: VaultNode[],
  expandedIds: Set<string>,
  query: string
): string[] {
  const normalizedQuery = query.trim().toLowerCase();
  const visible: string[] = [];

  if (!normalizedQuery) {
    const walk = (nodes: VaultNode[]) => {
      for (const node of nodes) {
        visible.push(node.id);
        if (node.type === "folder" && expandedIds.has(node.id) && node.children) {
          walk(node.children);
        }
      }
    };

    walk(roots);
    return visible;
  }

  const parentOf = new Map<string, string | null>();
  const matches = new Set<string>();

  const scan = (nodes: VaultNode[], parent: string | null) => {
    for (const node of nodes) {
      parentOf.set(node.id, parent);
      if (node.name.toLowerCase().includes(normalizedQuery)) {
        matches.add(node.id);
      }
      if (node.type === "folder" && node.children) {
        scan(node.children, node.id);
      }
    }
  };

  scan(roots, null);

  const included = new Set(matches);
  for (const matchId of matches) {
    let parent = parentOf.get(matchId) ?? null;
    while (parent) {
      included.add(parent);
      parent = parentOf.get(parent) ?? null;
    }
  }

  const walkMatches = (nodes: VaultNode[]) => {
    for (const node of nodes) {
      if (!included.has(node.id)) {
        continue;
      }
      visible.push(node.id);
      if (node.type === "folder" && node.children) {
        walkMatches(node.children);
      }
    }
  };

  walkMatches(roots);
  return visible;
}
