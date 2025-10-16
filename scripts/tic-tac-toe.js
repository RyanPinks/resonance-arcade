// scripts/tic-tac-toe.js

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
let currentPlayer = 'X';
let board = Array(9).fill(null);

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : 'Draw';
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index]) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    status.textContent = winner === 'Draw' ? "It's a draw!" : `${winner} wins!`;
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));

document.getElementById('restart').addEventListener('click', () => {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  status.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleClick);
  });
});
