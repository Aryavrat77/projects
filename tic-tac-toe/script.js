let cells = document.querySelectorAll(".cell");
cells.forEach(function (cell) {
  cell.addEventListener("click", game);
});

const numRows = 3;
const numCols = 3;
let numEmptyCells = numRows * numCols;
const board = new Array(numEmptyCells);
const markers = ["x", "o"];
let player = 0;
let gameIsOver = false;

// the main event listener and the controller for the game
function game(event) {
  if (gameIsOver)
    return window.alert(
      "This game has ended. Refresh the page for a new game!"
    );

  let cell = event.target;
  let index = cell.id;

  if (board[index]) return window.alert("This cell has already been marked!");

  // TODO update the board here
  board[index] = markers[player];
  cell.classList.add(markers[player]);
  numEmptyCells--;
  

  updateGameStatus();
  switchPlayer();
}

// switches the player value from 0 to 1 and vice versa
function switchPlayer() {
  player = player === 0 ? 1 : 0;
}

// updates gameIsOver to true if a player won the game
// or the game ended in a draw!
// side effect: displays an alert with a message as to
// who won the game or that the game ended in a draw!
function updateGameStatus() {
  if (checkRows() || checkColumns() || checkDiagonals()) {
    window.alert(`${markers[player]} won!`);
    gameIsOver = true;
  } else if (numEmptyCells === 0) {
    window.alert(`It's a draw!`);
    gameIsOver = true;
  }
}

// returns true if all cells in a row
// are marked with the same marker, otherwise returns false
function checkRows() {
  for (let row = 0; row < numRows; row++) {
    if (checkRow(row)) return true;
  }
  return false;
}

// returns true if all cells in the given row
// are marked with the same marker, otherwise returns false
function checkRow(row) {
  for (let col = 0; col < numCols; col++) {
    let index = toLinearIndex(row, col);
    if (board[index] !== markers[player]) return false;
  }
  return true;
}

// return the linear index corresponding to the row and column subscripts
function toLinearIndex(row, col) {
  return row * numRows + col;
}

// returns true if all cells in a column
// are marked with the same marker, otherwise returns false
function checkColumns() {
  // TODO Implement me!
  for (let col = 0; col < numCols; col++) {
    if (checkColumn(col)) return true;
  }
  return false;
}

// returns true if all cells in the given column
// are marked with the same marker, otherwise returns false
function checkColumn(col) {
  for (let row = 0; row < numRows; row++) {
    let index = toLinearIndex(row, col);
    if (board[index] !== markers[player]) return false;
  }
  return true;
}

// returns true if all cells in the major or minor diagonal
// are marked with the same marker, otherwise returns false
function checkDiagonals() {
  return checkMajorDiagonal() || checkMinorDiagonal();
}

// returns true if all cells in the major diagonal
// are marked with the same marker, otherwise returns false
function checkMajorDiagonal() {
  for (let row = 0; row < numRows; row++) {
    let index = toLinearIndex(row, row);
    if (board[index] !== markers[player]) return false;
  }
  return true;
}

// returns true if all cells in the minor diagonal
// are marked with the same marker, otherwise returns false
function checkMinorDiagonal() {
  let col = 0;
  for (let row = numRows - 1; row >= 0; row--) {
    let index = toLinearIndex(row, col++);
    if (board[index] !== markers[player]) return false;
  }
  return true;
}
