/**
 * 指定されたキーに基づいてカーソル位置を更新
 * 行および列の境界チェックを行い、移動先が有効な範囲内に収まるよう制御
 * @param {string} key - 移動方向を示すキー (h, j, k, l)
 */
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

/**
 * NORMALモード時のキー入力をハンドリング
 * 移動コマンドの呼び出し、または別モードへの遷移を実行
 * @param {string} key - 入力されたキー文字列
 */
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

/**
 * VISUALモード（LINE/BLOCK含む）時のキー入力をハンドリング
 * 移動処理、モードのトグル、またはNORMALモードへの復帰を実行
 * @param {string} key - 入力されたキー文字列
 */
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

