// Task 1: Higher or Lower
const MIN_NUMBER = 1;
const MAX_NUMBER = 10;
const START_LIVES = 3;
const WIN_STREAK_BONUS = 1;

const currentNumberElement = document.querySelector("#currentNumber");
const livesElement = document.querySelector("#lives");
const streakElement = document.querySelector("#streak");
const bestStreakElement = document.querySelector("#bestStreak");
const gameMessage = document.querySelector("#gameMessage");
const higherButton = document.querySelector("#guessHigher");
const lowerButton = document.querySelector("#guessLower");
const startButton = document.querySelector("#startGame");

let currentNumber = null;
let lives = START_LIVES;
let streak = 0;
let bestStreak = 0;
let gameOver = true;

function randomNumber() {
  return Math.floor(
    Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)
  ) + MIN_NUMBER;
}

function updateGame(message, type = "") {
  currentNumberElement.textContent =
    currentNumber === null ? "—" : currentNumber;

  livesElement.textContent = lives;
  streakElement.textContent = streak;
  bestStreakElement.textContent = bestStreak;

  gameMessage.textContent = message;
  gameMessage.className = "message " + type;

  higherButton.disabled = gameOver;
  lowerButton.disabled = gameOver;
}

function startGame() {
  currentNumber = randomNumber();
  lives = START_LIVES;
  streak = 0;
  gameOver = false;

  updateGame("Game started. Will the next number be higher or lower?");
}

function makeGuess(direction) {
  if (gameOver === true || currentNumber === null) {
    updateGame("Press Start / Restart before making a guess.", "error-text");
    return;
  }

  const nextNumber = randomNumber();

  const correct =
    (direction === "higher" && nextNumber >= currentNumber) ||
    (direction === "lower" && nextNumber <= currentNumber);

  currentNumber = nextNumber;

  if (correct === true) {
    streak += WIN_STREAK_BONUS;
    bestStreak = Math.max(bestStreak, streak);

    updateGame("Correct! The new number is " + nextNumber + ".");
  } else {
    lives -= 1;
    streak = 0;

    if (lives === 0) {
      gameOver = true;
      updateGame(
        "Game over. Press Start / Restart to play again.",
        "error-text"
      );
      return;
    }

    updateGame(
      "Not quite. The new number is " + nextNumber + ". Try again.",
      "error-text"
    );
  }
}

higherButton.addEventListener("click", () => makeGuess("higher"));
lowerButton.addEventListener("click", () => makeGuess("lower"));
startButton.addEventListener("click", startGame);

updateGame("Press Start to play.");