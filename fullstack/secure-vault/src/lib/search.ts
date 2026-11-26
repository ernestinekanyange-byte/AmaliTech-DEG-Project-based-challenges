import type { VaultNode } from "../data/types";

export function matchRanges(name: string, query: string): [number, number][] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const normalizedName = name.toLowerCase();
  const ranges: [number, number][] = [];
  let start = 0;

  while ((start = normalizedName.indexOf(normalizedQuery, start)) !== -1) {
    ranges.push([start, start + normalizedQuery.length]);
    start += normalizedQuery.length;
  }

  return ranges;
}

export function anyMatch(nodes: VaultNode[], query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const walk = (items: VaultNode[]): boolean =>
    items.some(
      (node) =>
        node.name.toLowerCase().includes(normalizedQuery) ||
        (node.children ? walk(node.children) : false)
    );

  return walk(nodes);
}
