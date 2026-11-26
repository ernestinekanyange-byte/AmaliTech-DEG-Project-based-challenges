# SecureVault Dashboard

A dark-mode file explorer for enterprise cloud-security vaults, built with React, TypeScript, Vite, and vanilla CSS.

[Open the live SecureVault demo](https://ernestinekanyange-byte.github.io/AmaliTech-DEG-Project-based-challenges/)

## Features

- Recursive folder tree supporting arbitrary nesting.
- Search across files and folders with highlighted matches and visible ancestor paths.
- Keyboard navigation with Arrow keys, Enter, Home, End, and Escape.
- File and folder properties with a full breadcrumb path and copy-path actions.
- Recursive file, folder, and storage totals.
- Responsive layout, accessible tree semantics, visible focus, and reduced-motion support.
- CSS custom properties aligned with the SecureVault design tokens.

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
npm run build
npm test
```

Vite serves the app at `http://localhost:5173`.

## Design File

[View the SecureVault design system and interface frames in Figma](https://www.figma.com/design/f2aAdmlZZOHzAr3TAJ7Y2x/Untitled--Copy-?node-id=0-1&t=H5VNo5LspgaNNVQ1-1)

The design system is implemented in `src/styles/tokens.css`; component styles use those shared custom properties.

## Recursive Strategy

`TreeNode` recursively renders the vault hierarchy. `buildIndex` creates ID and parent lookups, while `deriveVisible` produces the flattened visible-node order used by rendering and keyboard navigation. Search derives matching nodes and ancestors without changing expansion state, so clearing the query restores the prior tree.

## Keyboard

| Key | Action |
| --- | --- |
| Up / Down | Move focus between visible rows |
| Right | Expand a folder or focus its first visible child |
| Left | Collapse a folder or focus its parent |
| Enter | Select the focused item |
| Home / End | Focus the first or last visible row |
| Escape | Clear the search query |

## Data

The explorer loads the existing root `data.json` file without changing its contents.
