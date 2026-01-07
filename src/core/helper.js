/**
 * エディタの1行あたりの高さを動的に計算して取得
 * 一時的にダミー要素を作成して DOM に追加し、実際のレンダリング後の高さを計測
 * * @param {HTMLElement} editor - 行の高さを計測するための基準となるエディタの要素
 * @returns {number} 1行あたりのピクセル単位の高さ(取得失敗時はデフォルト値 24 を返却)
 */
function getLineHeight(editor) {
  const tempLine = document.createElement('div');

  tempLine.className = 'line';
  tempLine.innerHTML = '<span class="line-number">~</span>';
  editor.appendChild(tempLine);

  const height = tempLine.offsetHeight;
  editor.removeChild(tempLine);

  return height || 24;
}

/**
 * エディタの表示領域を埋めるために必要な最小行数を計算
 * 画面端までチルダ (~) 等を表示し、エディタらしい外観を維持するために使用
 * * @param {HTMLElement} editor - 計算対象となるエディタの親要素
 * @returns {number} 画面内に収まる最大の行数（小数点以下切り捨て）
 */
function calculateMinRows(editor) {
  const lineHeight = getLineHeight(editor);
  // エディタの表示可能領域（内寸）を行高さで割る
  return Math.floor(editor.clientHeight / lineHeight);
}

/**
 * カーソルが移動した際、現在の列位置が移動先の行の長さを超えていないか確認し、
 * 必要であればカーソルを行末の有効な位置へ強制的に補正（スナップ）させる
 */
function snapCursorToLine() {
  const lineLength = state.lines[state.cursor.row].length;
  if (state.cursor.col >= lineLength) {
    state.cursor.col = Math.max(0, lineLength - 1);
  }
}

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
 * 指定したモードへ安全に遷移し、必要なクリーンアップを行う
 * @param {string} nextMode - 次のモード (MODE.INSERT など)
 */
function transitionTo(nextMode) {
  // モードが変わる際、古いメッセージやエラーを消去する
  state.errorMessage = '';
  state.lastMessage = '';
  state.commandBuffer = '';
  state.lastExecutedDisplay = ''; 
  state.mode = nextMode;
}
