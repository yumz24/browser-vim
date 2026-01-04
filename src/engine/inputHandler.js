/**
 * キーボード入力イベントの監視
 * ブラウザのデフォルト挙動の抑制、および各モードのハンドラ呼び出しを実行
 */
window.addEventListener('keydown', (event) => {
  const key = event.key;

  // ブラウザのデフォルト挙動を抑制
  if (['h', 'j', 'k', 'l', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    event.preventDefault();
  }

  if (state.mode === MODE.NORMAL) {
    handleNormalMode(key);
  } else if (state.mode.startsWith('VISUAL')) {
    handleVisualMode(key);
  } else if (state.mode === MODE.COMMAND) {
    handleCommandMode(key);
  } else if (key === 'Escape') {
    state.mode = MODE.NORMAL;
  }

  render();
});
