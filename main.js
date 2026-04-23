const container = document.getElementById("puzzle-container");
const startBtn = document.getElementById("start-button");
let size, imgURL, debug;
let board = [];

startBtn.addEventListener("click", () => initGame(false));

function initGame(autoRestart) {
  debug = document.getElementById("debug-toggle").checked;
  size = parseInt(document.getElementById("grid-size").value);
  imgURL = autoRestart ? `https://picsum.photos/seed/${Math.random()}/400` : document.getElementById("image-url").value;
  debug = document.getElementById("debug-toggle").checked;

  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  board = [];
  for (let i = 0; i < size * size - 1; i++) board.push(i + 1);
  shuffle(board);
  board.push(null);
  drawBoard();
}

function drawBoard() {
  container.innerHTML = '';
  board.forEach((num, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (num === null) {
      tile.classList.add("empty");
    } else if (debug) {
      tile.textContent = num;
      tile.style.background = "#3b4252";
      tile.style.color = "#eceff4";
    } else {
      const row = Math.floor((num - 1) / size);
      const col = (num - 1) % size;
      tile.style.backgroundImage = `url(${imgURL})`;
      tile.style.backgroundPosition = `${(-col * 100) / (size - 1)}% ${(-row * 100) / (size - 1)}%`;
      tile.style.backgroundSize = `${size * 100}px ${size * 100}px`;
    }

    tile.addEventListener("click", () => handleMove(idx));
    container.appendChild(tile);
  });
}

function handleMove(clickedIndex) {
  const emptyIndex = board.indexOf(null);
  if (isAdjacent(clickedIndex, emptyIndex)) {
    [board[clickedIndex], board[emptyIndex]] = [board[emptyIndex], board[clickedIndex]];
    drawBoard();
    if (checkWin()) showWin();
  }
}

function isAdjacent(i1, i2) {
  const x1 = i1 % size, y1 = Math.floor(i1 / size);
  const x2 = i2 % size, y2 = Math.floor(i2 / size);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function checkWin() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return true;
}

function showWin() {
  container.innerHTML = '';
  const img = document.createElement("img");
  img.src = imgURL;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  container.appendChild(img);

  setTimeout(() => initGame(true), 2000);
}

function shuffle(array) {
  let n = array.length;
  while (n) {
    const i = Math.floor(Math.random() * n--);
    [array[n], array[i]] = [array[i], array[n]];
  }
}
document.addEventListener("DOMContentLoaded", () => {
  container.classList.add("fade-in");
  
  setTimeout(() => {
    initGame(true);
  }, 500);
});
