/**
 * COMMANDモード時のキー入力をハンドリング
 * 設定の変更等のコマンド実行またはNORMALモードへの復帰を実行
 * @param {string} key - 入力されたキー文字列
 */
function handleCommandMode(key) {
  if (key === 'Enter') {
    runCommand(state.commandBuffer);
    state.mode = MODE.NORMAL;
    state.commandBuffer = '';
  } else if (key === 'Escape') {
    transitionTo(MODE.NORMAL);
  }
   else if (key === 'Backspace') {
     state.commandBuffer = state.commandBuffer.slice(0, -1);
     if (state.commandBuffer === '' && key === 'Backspace') {
        transitionTo(MODE.NORMAL);
     }
   }
   else if (key.length === 1) {
     state.commandBuffer += key;
   }
}

/**
 * 入力されたコマンド文字列を解析して実行する
 * @param {string} rawCommand - コマンドバッファ内容
 */
function runCommand(rawCommand) {
  const input = rawCommand.trim();
  if (!input) return;

  state.commandHistory.push(input);
  state.lastExecutedDisplay = ':' + input;
  state.errorMessage = '';
  state.lastMessage = '';

  const args = input.split(/\s+/);
  const command = args[0];

  if (command === 'set') {
    const option = args[1];
    handleSetOption(option);
  } else {
    state.errorMessage = `E492: Not an editor command: ${command}`;
  }
  // TODO: その他コマンドを増やす場合はここにelse ifを追加
}

/**
 * :set 用のオプションハンドラ
 * @param {string} option - setコマンドのオプション内容
 */
function handleSetOption(option) {
  if (!option) return;

  let isNu = state.options.displaynumber === DISPLAY_NUMBER.NUMBER || state.options.displaynumber === DISPLAY_NUMBER.HYBRID;
  let isRnu = state.options.displaynumber === DISPLAY_NUMBER.RELATIVE || state.options.displaynumber === DISPLAY_NUMBER.HYBRID;

  switch (option) {
    case 'number':
    case 'nu':
      isNu = true;
      break;
    case 'nonumber':
    case 'nonu':
      isNu = false;
      break;
    case 'relativenumber':
    case 'rnu':
      isRnu = true;
      break;
    case 'norelativenumber':
    case 'nornu':
      isRnu = false;
      break;
    case 'cursorcolumn':
    case 'cuc':
      state.options.cursorcolumn = true;
      break;
    case 'nocursorcolumn':
    case 'nocuc':
      state.options.cursorcolumn = false;
      break;
    case 'cursorline':
    case 'cul':
      state.options.cursorline = true;
      break;
    case 'nocursorline':
    case 'nocul':
      state.options.cursorline = false;
      break;
    default:
      state.errorMessage = `E518: Unknown option: ${option}`;
      break;
  }

  if (isNu && isRnu) {
    state.options.displaynumber = DISPLAY_NUMBER.HYBRID;
  } else if (isNu) {
    state.options.displaynumber = DISPLAY_NUMBER.NUMBER;
  } else if (isRnu) {
    state.options.displaynumber = DISPLAY_NUMBER.RELATIVE;
  } else {
    state.options.displaynumber = DISPLAY_NUMBER.NONE;
  }
}
