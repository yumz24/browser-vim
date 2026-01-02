/* ==========================================================================
   STATE
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
  mode: 'NORMAL',
  options: {
    // 0: none, 1: number, 2: relativenumber, 3: hybrid (number + relativenumber)
    displaynumber: 3,
    numberwidth: 4,      // 最小の行番号幅は4
    cursorline: true,    // カレント行の強調
    foldcolumn: 0,       // 折りたたみカラム 1: 表示, 0: 非表示
  },
};

/* ==========================================================================
   RENDERING (表示制御)
   ========================================================================== */
// 一文字分のHTMLを生成する　
function createCharHtml(char, rowIndex, colIndex) {
  const isCursor = rowIndex === state.cursor.row && colIndex === state.cursor.col;
  return `<span class="${isCursor ? 'cursor' : ''}">${char}</span>`;
}

// 一行分の本文(文字+行末カーソル)のHTMLを生成する
function createLineContentHtml(line, rowIndex) {
  const isCurrentRow = rowIndex === state.cursor.row;
  const chars = line.split('');
  let contentHtml = chars.map((char, colIndex) => 
    createCharHtml(char, rowIndex, colIndex)
  ).join('');

  // 行末/空行のカーソル処理
  if (isCurrentRow && state.cursor.col >= chars.length) {
    contentHtml += `<span class="cursor">&nbsp;</span>`;
  }

  return contentHtml;
}

// 一行当たりの高さを取得する
function getLineHeight(editor) {
  const tempLine = document.createElement('div');
  tempLine.className = 'line';
  tempLine.innerHTML = '<span class="line-number">~</span>';
  editor.appendChild(tempLine);
  const height = tempLine.offsetHeight;
  editor.removeChild(tempLine);
  // 万が一取得できなかった場合のフォールバック
  return height || 24;
}

// 画面を埋めるために必要な最商業煤を計算
function calculateMinRows(editor) {
  const lineHeight = getLineHeight(editor);
  // エディタの表示可能領域（内寸）を行高さで割る
  return Math.floor(editor.clientHeight / lineHeight);
}

// 設定に基づいて表示すべき行番号のテキストを決定する
function getLineNumberText(rowIndex, state) {
  const isDataLine = rowIndex < state.lines.length;

  if (!isDataLine) {
    return "~";
  }

  const displaynumber = state.options.displaynumber;
  const actual = rowIndex + 1;
  const relative = Math.abs(rowIndex - state.cursor.row);

  switch (displaynumber) {
    case 1: return actual; // number
    case 2: return relative; // relativenumber (現在行は0)
    case 3: // hybrid (現在行だけ絶対、他は相対)
      return (rowIndex === state.cursor.row) ? actual : relative;
    default: return "";
  }
}

// 折りたたみカラムのHTML生成
function createFoldColumnHtml(state) {
  if (state.options.foldcolumn <= 0) return "";
  // TODO: 現時点では見た目だけなので、いずれロジックを実装する
  return `<span class="fold-column">-</span>`;
}

function render() {
  const editor = document.getElementById('editor');
  
  const minRows = calculateMinRows(editor);
  const totalLinesToRender = Math.max(state.lines.length, minRows);

  // 行番号領域を動的に決定する
  const numWidth = Math.max(state.options.numberwidth, String(totalLinesToRender).length);

  let finalHtml = "";

  for (let i = 0; i < totalLinesToRender; i++) {
    const isCurrentRow = i === state.cursor.row;

    // 折りたたみカラム
    const foldHtml = createFoldColumnHtml(state);

    // 行番号テキストの取得
    const lineNumberContent = getLineNumberText(i, state);
    const lineNumberHtml = `
      <span class="line-number ${isCurrentRow ? 'active-number' : ''}" 
            style="width: ${numWidth}rem;">
        ${lineNumberContent}
      </span>
    `.replace(/\s+/g, ' ').trim();

    // データがある行は内容を描画、ない行は空
    const isDataLine = i < state.lines.length;
    const contentHtml = isDataLine ? createLineContentHtml(state.lines[i], i) : "";

    finalHtml += `
      <div class="line ${isCurrentRow && state.options.cursorline ? 'active-line' : ''}">
        ${foldHtml}${lineNumberHtml}<div class="line-content">${contentHtml}</div>
      </div>
    `;
  }

  editor.innerHTML = finalHtml;
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
   LOGIC (状態操作)
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
   EVENTS (入り口)
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
