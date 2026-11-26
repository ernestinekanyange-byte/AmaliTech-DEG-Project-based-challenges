export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`tree-icon tree-icon--chevron${open ? " tree-icon--open" : ""}`}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 4l4 4-4 4V4z" />
    </svg>
  );
}

export function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`tree-icon${open ? " tree-icon--folder-open" : " tree-icon--folder"}`}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1.5 3h4l1.5 2h7.5v8h-13V3z" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg
      className="tree-icon tree-icon--file"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M4 1.5h5l3 3v10H4v-13zm5 0v3h3" />
    </svg>
  );
}
