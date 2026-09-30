const prevOperandEl = document.getElementById('prevOperand');
const currOperandEl = document.getElementById('currOperand');
const keys = document.querySelector('.keys');

let currentOperand = '0';
let previousOperand = '';
let operator = null;
let shouldResetCurrent = false;

function updateDisplay() {
  currOperandEl.textContent = formatNumber(currentOperand);
  prevOperandEl.textContent = previousOperand
    ? `${formatNumber(previousOperand)} ${operator}`
    : '';
}

function formatNumber(value) {
  if (value === '') return '';
  const [intPart, decPart] = value.toString().split('.');
  const formattedInt = new Intl.NumberFormat('en-IN').format(Number(intPart));
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

function inputNumber(digit) {
  if (currentOperand === '0' || shouldResetCurrent) {
    currentOperand = digit;
    shouldResetCurrent = false;
  } else {
    currentOperand += digit;
  }
}

function inputDecimal() {
  if (shouldResetCurrent) {
    currentOperand = '0';
    shouldResetCurrent = false;
  }
  if (!currentOperand.includes('.')) {
    currentOperand += '.';
  }
}

function chooseOperator(op) {
  if (operator && !shouldResetCurrent) {
    compute();
  }
  previousOperand = currentOperand;
  operator = op;
  shouldResetCurrent = true;
}

function compute() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '−':
      result = prev - curr;
      break;
    case '×':
      result = prev * curr;
      break;
    case '÷':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    default:
      return;
  }

  currentOperand = result === 'Error' ? 'Error' : trimResult(result);
  operator = null;
  previousOperand = '';
  shouldResetCurrent = true;
}

function trimResult(num) {
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operator = null;
  shouldResetCurrent = false;
}

function backspace() {
  if (shouldResetCurrent) return;
  currentOperand = currentOperand.slice(0, -1);
  if (currentOperand === '' || currentOperand === '-') {
    currentOperand = '0';
  }
}

function percent() {
  currentOperand = trimResult(parseFloat(currentOperand) / 100);
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('.key');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'number') inputNumber(btn.textContent);
  if (action === 'decimal') inputDecimal();
  if (action === 'operator') chooseOperator(btn.dataset.op);
  if (action === 'equals') compute();
  if (action === 'clear') clearAll();
  if (action === 'backspace') backspace();
  if (action === 'percent') percent();

  updateDisplay();
});

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('−');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') compute();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percent();
  else return;

  updateDisplay();
});

updateDisplay();
