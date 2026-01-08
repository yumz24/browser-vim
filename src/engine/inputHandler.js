/**
 * キーボードイベントの主要な振り分け
 */
window.addEventListener('keydown', (event) => {
  const key = event.key;

  // ブラウザ固有のショートカットやスクロールを抑制 
  if (['h', 'j', 'k', 'l', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    event.preventDefault();
  }

  /**
   * 現在のモードに応じたハンドラを呼び出し
   */
  switch (state.mode) {
    case MODE.NORMAL:
      handleNormalMode(key);
      break;
    case MODE.INSERT:
      handleInsertMode(key);
      break;
    case MODE.VISUAL:
    case MODE.VISUAL_LINE:
    case MODE.VISUAL_BLOCK:
      handleVisualMode(key);
      break;
    case MODE.COMMAND:
      handleCommandMode(key);
      break;
    default:
      if (key === 'Escape') state.mode = MODE.NORMAL;
  }

  render();
});
