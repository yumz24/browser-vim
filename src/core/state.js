/**
 * @typedef {Object} CursorPosition
 * @property {number} row - 0から始まる現在の行番号
 * @property {number} col - 0から始まる現在の列番号
 */

/**
 * @typedef {Object} EditorOptions
 * @property {0|1|2|3} displaynumber - 行番号の表示形式（0:非表示, 1:絶対行, 2:相対行, 3:ハイブリッド）
 * @property {number} numberwidth - 行番号表示エリアの最小幅
 * @property {boolean} cursorline - 現在行をハイライト表示するかどうかのフラグ
 * @property {boolean} cursorcolumn - 現在列をハイライト表示するかどうかのフラグ
 * @property {number} foldcolumn - 折りたたみ情報の表示カラム幅
 */

/**
 * エディタの共有状態を管理するオブジェクト
 * テキストデータ、カーソル位置、現在のモード、および表示設定を保持
 * * @type {Object}
 * @property {string[]} lines - 各行の文字列を格納する配列（改行コードは含まない）
 * @property {CursorPosition} cursor - 現在のカーソル位置
 * @property {'NORMAL'|'INSERT'|'VISUAL'|'VISUAL LINE'|'VISUAL BLOCK'|'COMMAND'|'REPLACE'} mode - 現在の操作モード
 * @property {string} commandBuffer - コマンドラインモードで入力した際の内容を保持
 * @property {string[]} commandHistory - 過去に実行されたコマンドの履歴を保持する配列
 * @property {string} lastExecutedDisplay - 最後に実行されたコマンド、または検索内容を表示用に保持
 * @property {number} historyIndex - コマンド履歴を遡る際の現在の参照位置
 * @property {string} errorMessage - 現在発生しているエラーメッセージ（画面表示用）
 * @property {string} lastErrorMessage - 直前に発生したエラーメッセージの記録
 * @property {EditorOptions} options - エディタの表示設定
 */
const state = {
  lines: [
    "Browser Vim - Web Edition",
    "",
    "version 0.1.0",
    "Developed by yumz24",
    "Browser Vim is open source and freely distributable",
    "",
    "Help independent developers!",
    "type    :help register<Enter>    for information",
    "",
    "type    :q<Enter>                to exit",
    "type    :help<Enter>  or  <F1>   for on-line help",
    "type    :help version0<Enter>    for version info",
  ],
  cursor: { row: 0, col: 0 },
  mode: MODE.NORMAL,
  commandBuffer: '',
  commandHistory: [],
  lastExecutedDisplay: '',
  historyIndex: -1,
  errorMessage: '',
  lastErrorMessage: '',
  options: {
    displaynumber: DISPLAY_NUMBER.HYBRID,
    numberwidth: 4,
    cursorline: true,
    cursorcolumn: true,
    foldcolumn: 0,
  },
};

