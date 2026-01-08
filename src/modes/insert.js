/**
 * INSERTモード時のキー入力をハンドリング
 * 文字の挿入、改行、削除、およびNORMALモードへの復帰を実行
 * @param {string} key - 入力されたキー文字列
 */
function handleInsertMode(key) {
  const { cursor, lines, } = state;
  const currentLine = lines[cursor.row];

  if (state.isComposing) return;

  if (key === 'Escape') {
    if (cursor.col > 0) {
      cursor.col--;
    }
    transitionTo(MODE.NORMAL);
    return;
  }

  if (key === 'Backspace') {
    if (cursor.col > 0) {
      const before = currentLine.slice(0, cursor.col - 1);
      const after = currentLine.slice(cursor.col);
      state.lines[cursor.row] = before + after;
      cursor.col--;
    } else if (cursor.row > 0) {
      const prevLine = lines[cursor.row - 1];
      const newCol = prevLine.length;
      state.lines[cursor.row - 1] = prevLine + currentLine;
      state.lines.splice(cursor.row, 1);
      cursor.row--;
      cursor.col = newCol;
    }
    return;
  }
  
  if (key === 'Enter') {
    const before = currentLine.slice(0, cursor.col);
    const after = currentLine.slice(cursor.col);

    state.lines[cursor.row] = before;
    state.lines.splice(cursor.row + 1, 0, after);

    cursor.row++;
    cursor.col = 0;
    return;
  }
    
  if (key.length === 1) {
    const before = currentLine.slice(0, cursor.col);
    const after = currentLine.slice(cursor.col);

    state.lines[cursor.row] = before + key + after;
    cursor.col++;
  }
}
