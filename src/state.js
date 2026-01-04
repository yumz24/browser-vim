/**
 * エディタの共有状態を管理するオブジェクト
 * テキストデータ、カーソル位置、現在のモード、および表示設定を保持
 * * @type {Object}
 * @property {string[]} lines - エディタ内の各行の文字列を格納する配列
 * @property {Object} cursor - 現在のカーソル位置
 * @property {number} cursor.row - 0から始まる現在の行番号
 * @property {number} cursor.col - 0から始まる現在の列番号
 * @property {string} mode - 現在の操作モード（NORMAL, INSERT, VISUAL等）
 * @property {Object} options - エディタの表示設定
 * @property {number} options.displaynumber - 行番号の表示形式（0:非表示, 1:絶対行, 2:相対行, 3:ハイブリッド）
 * @property {number} options.numberwidth - 行番号表示エリアの最小幅
 * @property {boolean} options.cursorline - 現在行をハイライト表示するかどうかのフラグ
 * @property {boolean} options.cursorcolumn - 現在列をハイライト表示するかどうかのフラグ
 * @property {number} options.foldcolumn - 折りたたみ情報の表示カラム幅
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
  mode: 'NORMAL',
  options: {
    displaynumber: 3,
    numberwidth: 4,
    cursorline: true,
    cursorcolumn: true,
    foldcolumn: 0,
  },
};

