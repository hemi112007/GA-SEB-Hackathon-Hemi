/*-------------------------------- Constants --------------------------------*/


const pizzaEmoji = '🍕';
const burgerEmoji = '🍔';

/*---------------------------- Variables (state) ----------------------------*/

let currentPlayer = 'Pizza';  
let gameState = ['', '', '', '', '', '', '', '', ''];  
let gameActive = true;  
let isAIEnabled = false; 

let playerPizzaScore = 0;
let playerBurgerScore = 0;

/*------------------------ Cached Element References ------------------------*/


const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const modeToggle = document.getElementById('modeToggle');
const playerPizzaScoreElem = document.getElementById('playerPizza-score');
const playerBurgerScoreElem = document.getElementById('playerBurger-score');

/*-------------------------------- Functions --------------------------------*/


function createBoard() {
  board.innerHTML = '';  
  gameState = ['', '', '', '', '', '', '', '', ''];  

  
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('sqr');
    square.id = i;
    square.addEventListener('click', handleClick);
    board.appendChild(square);
  }
}


function handleClick(event) {
  const square = event.target;
  const squareIndex = square.id;

  
  if (gameState[squareIndex] !== '' || !gameActive) {
    return;
  }

  
  gameState[squareIndex] = currentPlayer;
  square.innerHTML = '';  

  
  const emoji = (currentPlayer === 'Pizza') ? pizzaEmoji : burgerEmoji;
  square.innerHTML = emoji;

  
  if (checkWinner()) {
    gameActive = false;
    message.innerText = currentPlayer + " Wins!";
    updateScore(currentPlayer);
    highlightWinner();
  } else if (gameState.every(function(cell) { return cell !== ''; })) {

    gameActive = false;
    message.innerText = "It's a Tie!";
  } else {
    
    currentPlayer = (currentPlayer === 'Pizza') ? 'Burger' : 'Pizza';
    message.innerText = currentPlayer + "'s Turn";

    
    if (isAIEnabled && currentPlayer === 'Burger') {
      setTimeout(aiMove, 900);  
    }
  }
}


function aiMove() {
  const availableMoves = [];
  
  
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      availableMoves.push(i);
    }
  }

  if (availableMoves.length === 0) return;  

  
  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  gameState[move] = 'Burger';
  const square = document.getElementById(move);
  square.innerHTML = burgerEmoji;

  
  if (checkWinner()) {
    gameActive = false;
    message.innerText = "Burger Wins!";
    updateScore('Burger');
    highlightWinner();
  } else if (gameState.every(function(cell) { return cell !== ''; })) {
    
    gameActive = false;
    message.innerText = "It's a Tie!";
  } else {
    
    currentPlayer = 'Pizza';
    message.innerText = "Pizza's Turn";
  }
}


function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winPatterns.length; i++) {
    const pattern = winPatterns[i];
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return true;
    }
  }
  return false;
}


function highlightWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winPatterns.length; i++) {
    const pattern = winPatterns[i];
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      document.getElementById(a).classList.add('win');
      document.getElementById(b).classList.add('win');
      document.getElementById(c).classList.add('win');
    }
  }
}


function updateScore(winner) {
  if (winner === 'Pizza') {
    playerPizzaScore++;
    playerPizzaScoreElem.textContent = "Pizza: " + playerPizzaScore;
  } else if (winner === 'Burger') {
    playerBurgerScore++;
    playerBurgerScoreElem.textContent = "Burger: " + playerBurgerScore;
  }
}


function restartGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'Pizza';

  const squares = board.querySelectorAll('.sqr');
  squares.forEach(function(square) {
    square.innerHTML = '';
    square.classList.remove('win');
  });

  message.innerText = currentPlayer + "'s Turn";
}

/*----------------------------- Event Listeners -----------------------------*/

restartBtn.addEventListener('click', restartGame);
modeToggle.addEventListener('click', function() {
  isAIEnabled = !isAIEnabled;
  modeToggle.textContent = isAIEnabled ? 'Play vs. Player' : 'Play vs. AI';
  restartGame();
});

createBoard();
message.innerText = currentPlayer + "'s Turn";

