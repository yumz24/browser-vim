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

  if (state.mode === 'NORMAL') {
    handleNormalMode(key);
  } else if (state.mode.startsWith('VISUAL')) {
    handleVisualMode(key);
  } else if (key === 'Escape') {
    state.mode = 'NORMAL';
  }

  render();
});

/**
 * アプリケーションの初期描画を実行
 */
render();
