/**
 * 1文字分のHTML要素を生成
 * カーソル位置と一致する場合は専用のクラスを付与
 * * @param {string} char - 表示対象の文字
 * @param {number} rowIndex - 行インデックス
 * @param {number} colIndex - 列インデックス
 * @returns {string} spanタグでラップされた文字のHTML
 */
function createCharHtml(char, rowIndex, colIndex) {
  const isCursor = rowIndex === state.cursor.row && colIndex === state.cursor.col;
  return `<span class="${isCursor ? 'cursor' : ''}">${char}</span>`;
}

/**
 * 折りたたみカラムのHTMLを生成
 * * @param {Object} state - アプリケーションの状態オブジェクト
 * @returns {string} 折りたたみインジケータのHTML
 */
function createFoldColumnHtml(state) {
  if (state.options.foldcolumn <= 0) return "";
  // TODO: 現時点では見た目だけなので、いずれロジックを実装する
  return `<span class="fold-column">-</span>`;
}

/**
 * 設定に基づいて表示すべき行番号のテキストを決定
 * * @param {number} rowIndex - 対象行のインデックス
 * @param {Object} state - アプリケーションの状態オブジェクト
 * @returns {string|number} 行番号またはチルダ記号
 */
function getLineNumberText(rowIndex, state) {
  const isDataLine = rowIndex < state.lines.length;

  if (!isDataLine) {
    return "~";
  }

  const displaynumber = state.options.displaynumber;
  const actual = rowIndex + 1;
  const relative = Math.abs(rowIndex - state.cursor.row);

  switch (displaynumber) {
    case DISPLAY_NUMBER.NUMBER: return actual;
    case DISPLAY_NUMBER.RELATIVE: return relative;
    case DISPLAY_NUMBER.HYBRID:
      return (rowIndex === state.cursor.row) ? actual : relative;
    default: return "";
  }
}

/**
 * 1行分の本文（文字群および行末カーソル）のHTMLを生成
 * * @param {string} line - 行のテキスト内容
 * @param {number} rowIndex - 行インデックス
 * @returns {string} 行内容のHTML
 */
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

/**
 * 画面下部のステータスラインを生成および更新
 * モードに応じたクラス付与とカーソル位置の表示を行う
 */
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

/**
 * 画面下部のコマンドラインを更新
 * モードやメッセージ、実行履歴の状態に応じて表示内容を切り替える
 */
function renderCommandLine() {
  const commandLineElem = document.getElementById('commandline');
  commandLineElem.innerHTML = '';

  if (state.mode === MODE.COMMAND) {
    const prefix = ':';
    const text = state.commandBuffer;
    
    const prefixSpan = document.createElement('span');
    prefixSpan.textContent = prefix;
    commandLineElem.appendChild(prefixSpan);

    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      if (index === text.length) {
        span.classList.add('cursor');
      }

      commandLineElem.appendChild(span);
    });

    const cursorSpan = document.createElement('span');
    cursorSpan.innerHTML = '&nbsp';
    cursorSpan.classList.add('cursor');
    commandLineElem.appendChild(cursorSpan);

    commandLineElem.className = '';
  } else if (state.errorMessage) {
    // エラーがある場合は赤文字などで表示
    commandLineElem.textContent = state.errorMessage;
    commandLineElem.className = 'error-msg'; 
  } else if (state.lastMessage) {
    // 通常の通知メッセージ
    commandLineElem.textContent = state.lastMessage;
    commandLineElem.className = 'info-msg';
  } else {
    commandLineElem.textContent = state.lastExecutedDisplay || '';
    commandLineElem.className = '';
  }
}

/**
 * エディタ全体のHTMLを生成および更新
 * 画面サイズに基づいた最小行数の確保と各行のレンダリングを実行
 */
function render() {
  const editor = document.getElementById('editor');
  
  editor.classList.toggle('show-cursorcolumn', state.options.cursorcolumn);
  editor.style.setProperty('--cursor-col', state.cursor.col);

  const minRows = calculateMinRows(editor);
  const totalLinesToRender = Math.max(state.lines.length, minRows);
  const numWidth = Math.max(state.options.numberwidth, String(totalLinesToRender).length);

  let finalHtml = "";

  for (let i = 0; i < totalLinesToRender; i++) {
    const isCurrentRow = i === state.cursor.row;

    const foldHtml = createFoldColumnHtml(state);
    const lineNumberContent = getLineNumberText(i, state);
    const lineNumberHtml = `
      <span class="line-number ${isCurrentRow ? 'active-number' : ''}" 
            style="width: ${numWidth}rem;">
        ${lineNumberContent}
      </span>
    `.replace(/\s+/g, ' ').trim();

    const isDataLine = i < state.lines.length;
    const contentHtml = isDataLine ? createLineContentHtml(state.lines[i], i) : "";

    finalHtml += `
      <div class="line ${isCurrentRow && state.options.cursorline ? 'active-line' : ''}">
        ${foldHtml}${lineNumberHtml}<span class="line-content">${contentHtml || ' '}</span>
      </div>
    `;
  }

  editor.innerHTML = finalHtml;
  renderStatusLine();
  renderCommandLine();
}

