import type { VaultNode } from "../data/types";

const UNIT: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3
};

export function parseSize(size?: string): number {
  if (!size) {
    return 0;
  }

  const match = size.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
  if (!match) {
    return 0;
  }

  const amount = Number.parseFloat(match[1]);
  return Number.isFinite(amount) ? amount * UNIT[match[2].toUpperCase()] : 0;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const formatted = value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
}

export interface Totals {
  files: number;
  folders: number;
  bytes: number;
}

export function computeTotals(nodes: VaultNode[]): Totals {
  const totals: Totals = { files: 0, folders: 0, bytes: 0 };

  const walk = (items: VaultNode[]) => {
    for (const node of items) {
      if (node.type === "folder") {
        totals.folders += 1;
        if (node.children) {
          walk(node.children);
        }
      } else {
        totals.files += 1;
        totals.bytes += parseSize(node.size);
      }
    }
  };

  walk(nodes);
  return totals;
}

export function childCount(node: VaultNode): number {
  return node.children?.length ?? 0;
}
