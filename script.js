// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // countdown interval
let timeLeft = 30; // seconds
let score = 0;

// Messages arrays
const winMessages = [
  "You brought clean water! Amazing work!",
  "You're a water hero — well done!",
  "20+ drops collected — you win!"
];
const loseMessages = [
  "Almost there — try again!",
  "Keep practicing — you can do it!",
  "Don't give up — one more round!"
];

// Wait for button click to start the game
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  resetBtn.disabled = false;

  // Reset score and timer UI
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;

  // Hide end overlay if visible
  document.getElementById("end-overlay").classList.add("hidden");

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Start countdown
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Randomly make some drops 'dirty' (bad) that subtract points
  const isBad = Math.random() < 0.25; // 25% chance
  if (isBad) {
    drop.classList.add('bad-drop');
  }

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // When a drop is clicked, adjust score and remove it
  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    if (drop.classList.contains('bad-drop')) {
      score = Math.max(0, score - 1);
      drop.style.transform = "scale(0.8) rotate(-10deg)";
    } else {
      score += 1;
      drop.style.transform = "scale(1.4)";
    }
    document.getElementById("score").textContent = score;
    setTimeout(() => drop.remove(), 120);
  });
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("end-overlay").classList.add("hidden");
  document.querySelectorAll('.water-drop').forEach(d => d.remove());
  resetBtn.disabled = true;
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  // Remove remaining drops
  document.querySelectorAll('.water-drop').forEach(d => d.remove());

  // Choose message set based on score
  const won = score >= 20;
  const title = won ? 'You Win!' : 'Try Again';
  const messages = won ? winMessages : loseMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  // Show overlay
  document.getElementById('end-title').textContent = title;
  document.getElementById('end-message').textContent = message;
  document.getElementById('end-overlay').classList.remove('hidden');
  resetBtn.disabled = false;
}
