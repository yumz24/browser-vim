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

