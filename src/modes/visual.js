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
    case 'v': 
      transitionTo(state.mode === MODE.VISUAL ? MODE.VISUAL_BLOCK : MODE.VISUAL); 
      break;
    case 'V': 
      transitionTo(state.mode === MODE.VISUAL_LINE ? MODE.VISUAL : MODE.VISUAL_LINE); 
      break;
    case 'Escape': 
      transitionTo(MODE.NORMAL);
      break;
  }
}

