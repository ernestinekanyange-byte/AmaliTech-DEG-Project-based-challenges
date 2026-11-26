export type NodeType = "folder" | "file";

export interface VaultNode {
  id: string;
  name: string;
  type: NodeType;
  children?: VaultNode[];
  size?: string;
}

export interface VaultIndex {
  byId: Map<string, VaultNode>;
  parentOf: Map<string, string | null>;
  order: string[];
}
