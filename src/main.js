const state = {
  // エディタないのテキスト
  lines: [
    "VIM - Vi IMproved",
    "",
    "version 1.1.1111",
    "by Bram Moolenaar et al.",
    "Vim is open source and freely distributable",
    "",
    "Become a registered Vim user!",
    "type    :help register<Enter>    for information",
    "",
    "type    :q<Enter>                to exit",
    "type    :help<Enter>  or  <F1>   for on-line help",
    "type    :help version9<Enter>    for version info", 
  ],
  // カーソル位置(0始まり)
  cursor: {
    row: 0,
    col: 0,
  },
  // モード: [ 'NORMAL', 'INSERT', 'COMMAND', 'REPLACE, 'VISUAL', 'VISUAL BLOCK', 'VISUAL LINE' ]
  mode: 'NORMAL'
}


// rendering
function render() {
  const editor = document.getElementById('editor');

  editor.innerHTML = state.lines.map((line, index) => {
    return `<div class="line">${line || '&nbsp;'}</div>`;
  }).join('');

  renderStatusLine();
}

function renderStatusLine() {
  const statusline = document.getElementById('statusline');

  // get mode
  const current_mode = state.mode;

  // reset class name and add class name
  statusline.className = '';
  const classes = [`mode-${current_mode.toLowerCase()}`, ];

  statusline.classList.add(...classes);

  statusline.innerHTML = `
    <div class="status-left">${current_mode}</div>
    <div class="status-right">${state.cursor.row + 1}:${state.cursor.col + 1}</div>
  `;
}

render();
