const app = document.querySelector('#app');

const state = {
  data: [],
  expanded: new Set(['root_1', 'leg_1']),
  selected: null,
  search: ''
};

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="SecureVault home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10m-10 0h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"/><circle cx="12" cy="15.5" r="1.25"/></svg>
        </span>
        <span>Secure<span>Vault</span></span>
      </a>
      <div class="top-actions">
        <span class="status"><i></i> Vault protected</span>
        <button class="icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>
        </button>
        <div class="avatar" aria-label="User profile">JC</div>
      </div>
    </header>

    <main class="workspace">
      <section class="explorer" aria-label="File explorer">
        <div class="explorer-header">
          <div>
            <p class="eyebrow">Enterprise vault</p>
            <h1>File Explorer</h1>
          </div>
          <button class="new-button" type="button" id="new-folder">
            <span aria-hidden="true">+</span> New
          </button>
        </div>

        <label class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
          <input id="search-input" type="search" placeholder="Search files and folders" autocomplete="off">
        </label>

        <div class="tree" id="tree" role="tree" aria-label="Vault contents"></div>
      </section>

      <aside class="properties" aria-label="Properties panel">
        <div class="properties-heading">
          <p class="eyebrow">Inspector</p>
          <h2>Properties</h2>
        </div>
        <div id="properties-content" class="properties-content"></div>
      </aside>
    </main>
  </div>
`;

function folderIcon() {
  return `<svg class="folder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`;
}

function fileIcon(name) {
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  return `<span class="file-icon file-${ext}" aria-hidden="true">${ext ? ext.slice(0, 3).toUpperCase() : 'FILE'}</span>`;
}

function countChildren(node) {
  if (!node.children) return 0;
  return node.children.reduce((total, child) => total + 1 + countChildren(child), 0);
}

function itemMatches(node, query) {
  if (node.name.toLowerCase().includes(query)) return true;
  return node.children ? node.children.some((child) => itemMatches(child, query)) : false;
}

function getParentPath(targetId, nodes = state.data, path = []) {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === targetId) return nextPath;
    if (node.children) {
      const result = getParentPath(targetId, node.children, nextPath);
      if (result) return result;
    }
  }
  return null;
}

function renderTree() {
  const tree = document.querySelector('#tree');
  const query = state.search.trim().toLowerCase();
  tree.innerHTML = '';

  function renderNode(node, level, parentElement) {
    if (query && !itemMatches(node, query)) return;

    const isFolder = node.type === 'folder';
    const isExpanded = query ? itemMatches(node, query) : state.expanded.has(node.id);
    const row = document.createElement('div');
    row.className = 'tree-row';
    row.dataset.id = node.id;
    row.dataset.level = String(level);
    row.setAttribute('role', 'treeitem');
    row.setAttribute('aria-level', String(level + 1));
    row.setAttribute('aria-selected', String(state.selected?.id === node.id));
    if (isFolder) row.setAttribute('aria-expanded', String(isExpanded));
    row.tabIndex = state.selected?.id === node.id ? 0 : -1;
    row.style.setProperty('--level', level);

    const chevron = isFolder
      ? `<button class="chevron ${isExpanded ? 'open' : ''}" type="button" aria-label="${isExpanded ? 'Collapse' : 'Expand'} ${node.name}">${chevronIcon()}</button>`
      : `<span class="chevron-placeholder"></span>`;

    row.innerHTML = `
      ${chevron}
      ${isFolder ? folderIcon() : fileIcon(node.name)}
      <span class="item-name">${node.name}</span>
      ${isFolder ? `<span class="item-count">${countChildren(node)}</span>` : `<span class="item-size">${node.size}</span>`}
    `;

    if (state.selected?.id === node.id) row.classList.add('selected');

    row.addEventListener('click', (event) => {
      event.stopPropagation();
      selectItem(node);
      if (isFolder) {
        state.expanded.has(node.id) ? state.expanded.delete(node.id) : state.expanded.add(node.id);
        renderTree();
        focusItem(node.id);
      }
    });

    parentElement.appendChild(row);

    if (isFolder && isExpanded && node.children) {
      node.children.forEach((child) => renderNode(child, level + 1, parentElement));
    }
  }

  state.data.forEach((node) => renderNode(node, 0, tree));
  if (!tree.children.length) {
    tree.innerHTML = `<div class="empty-state">No files or folders match "${escapeHtml(state.search)}"</div>`;
  }
}

function chevronIcon() {
  return `<svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5"/></svg>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);
}

function selectItem(node) {
  state.selected = node;
  renderProperties(node);

  document.querySelectorAll('.tree-row').forEach((row) => {
    const selected = row.dataset.id === node.id;
    row.classList.toggle('selected', selected);
    row.setAttribute('aria-selected', String(selected));
    row.tabIndex = selected ? 0 : -1;
  });
}

function renderProperties(node) {
  const content = document.querySelector('#properties-content');
  const path = getParentPath(node.id)?.map((item) => item.name).join(' / ') || node.name;
  const isFolder = node.type === 'folder';
  const extension = isFolder ? 'Folder' : (node.name.includes('.') ? node.name.split('.').pop().toUpperCase() : 'File');

  content.innerHTML = `
    <div class="preview-card">
      ${isFolder ? folderIcon() : fileIcon(node.name)}
      <div>
        <h3>${escapeHtml(node.name)}</h3>
        <p>${isFolder ? 'Secure folder' : extension + ' document'}</p>
      </div>
    </div>
    <dl class="property-list">
      <div><dt>Name</dt><dd title="${escapeHtml(node.name)}">${escapeHtml(node.name)}</dd></div>
      <div><dt>Type</dt><dd>${extension}</dd></div>
      <div><dt>${isFolder ? 'Contents' : 'Size'}</dt><dd>${isFolder ? countChildren(node) + ' items' : node.size}</dd></div>
      <div><dt>Location</dt><dd title="${escapeHtml(path)}">${escapeHtml(path)}</dd></div>
    </dl>
  `;
}

function focusItem(id) {
  requestAnimationFrame(() => {
    document.querySelector(`.tree-row[data-id="${CSS.escape(id)}"]`)?.focus();
  });
}

function getVisibleRows() {
  return [...document.querySelectorAll('.tree-row')];
}

document.querySelector('#search-input').addEventListener('input', (event) => {
  state.search = event.target.value;
  renderTree();
});

document.querySelector('#new-folder').addEventListener('click', () => {
  document.querySelector('#search-input').focus();
  document.querySelector('#search-input').select();
});

document.querySelector('#tree').addEventListener('keydown', (event) => {
  const row = event.target.closest('.tree-row');
  if (!row) return;
  const id = row.dataset.id;
  const node = findNode(id);
  if (!node) return;

  const rows = getVisibleRows();
  const index = rows.indexOf(row);

  if (event.key === 'ArrowDown') {
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
  } else if (event.key === 'ArrowRight' && node.type === 'folder') {
    event.preventDefault();
    state.expanded.add(id);
    renderTree();
    focusItem(id);
  } else if (event.key === 'ArrowLeft' && node.type === 'folder') {
    event.preventDefault();
    state.expanded.delete(id);
    renderTree();
    focusItem(id);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    selectItem(node);
  } else {
    return;
  }

  if (event.key === 'ArrowDown') {
    rows[Math.min(index + 1, rows.length - 1)]?.focus();
  } else if (event.key === 'ArrowUp') {
    rows[Math.max(index - 1, 0)]?.focus();
  }
});

function findNode(id, nodes = state.data) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const result = findNode(id, node.children);
      if (result) return result;
    }
  }
  return null;
}

fetch('/data.json')
  .then((response) => {
    if (!response.ok) throw new Error(`Unable to load data.json (${response.status})`);
    return response.json();
  })
  .then((data) => {
    state.data = data;
    renderTree();
  })
  .catch((error) => {
    document.querySelector('#tree').innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  });
