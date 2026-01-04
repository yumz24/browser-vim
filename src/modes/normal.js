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
    case 'i': transitionTo(MODE.INSERT); break;
    case 'v': transitionTo(MODE.VISUAL); break;
    case 'V': transitionTo(MODE.VISUAL_LINE); break;
    case 'R': transitionTo(MODE.REPLACE); break;
    case ':': transitionTo(MODE.COMMAND); break;
  }
}

