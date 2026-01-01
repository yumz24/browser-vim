/* ==========================================================================
   1. STATE
   ========================================================================== */
const state = {
  lines: [
    "VIM - Vi IMproved", "", "version 1.1.1111",
    "by Bram Moolenaar et al.", "Vim is open source and freely distributable",
    "", "Become a registered Vim user!",
    "type    :help register<Enter>    for information", "",
    "type    :q<Enter>                to exit",
    "type    :help<Enter>  or  <F1>   for on-line help",
    "type    :help version9<Enter>    for version info", 
  ],
  cursor: { row: 0, col: 0 },
  mode: 'NORMAL'
};

/* ==========================================================================
   2. RENDERING (表示制御)
   ========================================================================== */
function render() {
  const editor = document.getElementById('editor');
  
  editor.innerHTML = state.lines.map((line, rowIndex) => {
    const isCurrentRow = rowIndex === state.cursor.row;
    const chars = line.split('');

    // 文字の描画
    const charHtml = chars.map((char, colIndex) => {
      const isCursor = isCurrentRow && colIndex === state.cursor.col;
      return `<span class="${isCursor ? 'cursor' : ''}">${char}</span>`;
    }).join('');

    // 行末/空行のカーソル
    const isEndCursor = isCurrentRow && state.cursor.col >= chars.length;
    const endCursorHtml = isEndCursor ? `<span class="cursor">&nbsp;</span>` : '';
    
    return `<div class="line ${isCurrentRow ? 'active-line' : ''}">${charHtml}${endCursorHtml}</div>`;
  }).join('');

  renderStatusLine();
}

function renderStatusLine() {
  const statusline = document.getElementById('statusline');
  const { mode, cursor } = state;

  const safeModeName = mode.toLowerCase().replaceAll(' ', '-');
  statusline.className = '';
  statusline.classList.add(`mode-${safeModeName}`);

  statusline.innerHTML = `
    <div class="status-left">${mode}</div>
    <div class="status-right">${cursor.row + 1}:${cursor.col + 1}</div>
  `;
}

/* ==========================================================================
   3. LOGIC (状態操作)
   ========================================================================== */

// 移動ロジックの共通化
function moveCursor(key) {
  const { cursor, lines } = state;
  const currentLine = lines[cursor.row];

  switch (key) {
    case 'h': if (cursor.col > 0) cursor.col--; break;
    case 'j': 
      if (cursor.row < lines.length - 1) {
        cursor.row++;
        snapCursorToLine();
      }
      break;
    case 'k': 
      if (cursor.row > 0) {
        cursor.row--;
        snapCursorToLine();
      }
      break;
    case 'l': 
      if (cursor.col < currentLine.length - 1) cursor.col++;
      break;
  }
}

function snapCursorToLine() {
  const lineLength = state.lines[state.cursor.row].length;
  if (state.cursor.col >= lineLength) {
    state.cursor.col = Math.max(0, lineLength - 1);
  }
}

// モードごとのハンドラー
function handleNormalMode(key) {
  if (['h', 'j', 'k', 'l'].includes(key)) {
    moveCursor(key);
    return;
  }

  switch (key) {
    case 'v': state.mode = 'VISUAL'; break;
    case 'V': state.mode = 'VISUAL LINE'; break;
    case 'R': state.mode = 'REPLACE'; break;
    case 'i': state.mode = 'INSERT'; break;
  }
}

function handleVisualMode(key) {
  if (['h', 'j', 'k', 'l'].includes(key)) {
    moveCursor(key);
    return;
  }

  switch (key) {
    case 'v': state.mode = (state.mode === 'VISUAL') ? 'VISUAL BLOCK' : 'VISUAL'; break;
    case 'V': state.mode = (state.mode === 'VISUAL LINE') ? 'VISUAL' : 'VISUAL LINE'; break;
    case 'Escape': state.mode = 'NORMAL'; break;
  }
}

/* ==========================================================================
   4. EVENTS (入り口)
   ========================================================================== */
window.addEventListener('keydown', (event) => {
  const key = event.key;

  // ブラウザのデフォルト挙動を抑制
  if (['h', 'j', 'k', 'l', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    event.preventDefault();
  }

  if (state.mode === 'NORMAL') {
    handleNormalMode(key);
  } else if (state.mode.startsWith('VISUAL')) {
    handleVisualMode(key);
  } else if (key === 'Escape') {
    state.mode = 'NORMAL';
  }

  render();
});

// 初期起動
render();
