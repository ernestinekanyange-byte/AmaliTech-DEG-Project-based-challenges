# SecureVault Explorer

A responsive, keyboard-accessible file explorer for the SecureVault enterprise vault. It renders the exact folder and file structure from `data.json`.

## Setup

Serve the project with any static web server:

```bash
npx http-server . -p 5500
```

Open `http://127.0.0.1:5500`.

## Project Structure

```text
secure-vault/
├── index.html
├── data.json
├── README.md
├── LICENSE
└── src/
    ├── main.js
    └── styles.css
```

## Design File

[View the SecureVault design system and interface frames in Figma](https://www.figma.com/design/f2aAdmlZZOHzAr3TAJ7Y2x/Untitled--Copy-?node-id=0-1&t=H5VNo5LspgaNNVQ1-1)

## Features

- Recursive folder rendering with unlimited nesting
- Expand/collapse folders
- File selection and metadata properties panel
- Search across file and folder names, with ancestor folders expanded automatically
- Keyboard navigation with Up/Down, Right/Left, and Enter
- Responsive dark-mode interface

## Recursive Strategy

The `renderNode` function accepts a node and its depth, then recursively renders each child with `level + 1`. Folder expansion is tracked by item ID in a `Set`, while selection and search state remain independent. This separates traversal, rendering, and interaction state and supports any depth present in the JSON.

## Wildcard Feature

Search was implemented as an additional feature because large vaults need faster discovery than manual folder traversal. Matching descendants automatically reveal their ancestor folders, letting users find deeply nested documents without repeatedly opening the tree.
