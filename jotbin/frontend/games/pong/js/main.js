// html elements
const canvas = document.querySelector("#game");
const c = canvas.getContext("2d");

const titleContainer = document.querySelector("#title-container");
const playerScoreCounter = document.querySelector("#player-score-counter");
const cpuScoreCounter = document.querySelector("#cpu-score-counter");
const classicButton = document.querySelector("#classic-text");
const endlessButton = document.querySelector("#endless-text");
const gameOverContainer = document.querySelector("#game-over-container");
const winnerText = document.querySelector("#winner-text");
const restartButton = document.querySelector("#restart-button");
const exitButton = document.querySelector("#exit-button");
const root = document.querySelector(":root");

// audio
const bounceSounds = [
  new Audio("sfx/bounce1.mp3"),
  new Audio("sfx/bounce2.mp3"),
  new Audio("sfx/bounce3.mp3"),
  new Audio("sfx/bounce4.mp3"),
  new Audio("sfx/bounce5.mp3")
];
const missSound = new Audio("sfx/miss.mp3");
const selectSounds = [
  new Audio("sfx/select1.mp3"),
  new Audio("sfx/select2.mp3"),
  new Audio("sfx/select3.mp3")
];
const startSound = new Audio("sfx/start.mp3");

// fps control
let fps = {
  targetInterval: 1000 / 65, // second / fps
  startTime: Date.now(),
  elapsedTime: 0
}

// consts
const primaryColor = '#FBFAF5';
const secondaryColor = '#DDDDDD';
const pauseTime = 1000;
const wallWidth = 30;
const controllerLength = 50;
const controllerOffset = 10;
const endAt = 5;

const ballSize = 5;
const ballSpeed = 3;
const speedMultiplier = 1.1;
const speedCap = {
  x: 33,
  y: 15
};
const trailIntensity = 5;

const aiSpeed = 10;
const aiAccuracy = 55; // 0 = best

// vars
var frame;

var playerScore = 0;
var cpuScore = 0;
var hits;
var gamemode;

var mouseVelocity;

var ball;
var cpu;
var player;

// css vars
root.style.setProperty("--primary-color", primaryColor);

// objs
class Ball {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = {
      x: speed,
      y: speed
    }
    this.hitbox = {
      x: 0,
      y: 0,
      width: this.radius * 2,
      height: this.radius * 2
    }
    this.estimate = {
      x,
      y,
      velocity: {
        x,
        y
      }
    }
    this.prevPos = {
      x: [],
      y: []
    }
  }

  update() {
    // check colision
    //  walls
    if (this.hitbox.y + this.hitbox.height > canvas.height - wallWidth ||
      this.hitbox.y < wallWidth) {
        this.velocity.y = -this.velocity.y;
        bounceSounds[Math.floor(Math.random() * 4.9)].play();
    }

    //   player
    if (this.velocity.x > 0 &&
      (colided(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height, player.x + player.width, player.y, -player.width, player.height))) {
        hits++;

        this.velocity.x *= speedMultiplier;
        this.velocity.y += mouseVelocity;
        this.velocity.x = -this.velocity.x;
        if (this.velocity.y > speedCap.y) {
          this.velocity.y = speedCap.y;
        } else if (this.velocity.y < -speedCap.y) {
          this.velocity.y = -speedCap.y;
        }
        if (this.velocity.x > speedCap.x) {
          this.velocity.x = speedCap.x;
        } else if (this.velocity.x < -speedCap.x) {
          this.velocity.x = -speedCap.x;
        }

        this.estimatePos();
        moveCpu();

        if (gamemode === "endless") {
          updateScore();
        }
        bounceSounds[Math.floor(Math.random() * 4.9)].play();
    }
    
    //   cpu
    if (this.velocity.x < 0 &&
      (colided(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height, cpu.x, cpu.y, cpu.width, cpu.height) ||
      (gamemode === "endless" && this.hitbox.x < controllerOffset + cpu.width))) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y += cpu.velocity.y;
        bounceSounds[Math.floor(Math.random() * 4.9)].play();
    }

    //  goal
    if (this.hitbox.x < 0 &&
      this.velocity.x < 0) { // player score
      missSound.play();
      playerScore++;
      updateScore();
    } else if (this.hitbox.x + this.hitbox.width > canvas.width &&
      this.velocity.x > 0) { // cpu score
      missSound.play();
      if (gamemode === "classic") {
        cpuScore++;
        updateScore();
      } else {
        endGame();
      }
    }

    // update x/y
    this.prevPos.x.unshift(this.x);
    this.prevPos.y.unshift(this.y);
    if (this.prevPos.x.length > trailIntensity) {
      this.prevPos.x.pop();
      this.prevPos.y.pop();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // update hitbox

    if (this.velocity.x > 0) {
      this.hitbox.x = this.x - this.radius;
      this.hitbox.width = (this.x + this.velocity.x + this.radius + 1) - this.hitbox.x;
    } else {
      this.hitbox.x = this.x + this.velocity.x - this.radius - 1;
      this.hitbox.width = (this.x + this.radius) - this.hitbox.x;
    }
    this.hitbox.y = this.y - this.radius + this.velocity.y + 1;

    this.draw();
  }

  draw() {
    c.beginPath();
    c.fillStyle = secondaryColor;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();

    // fade effect
    for (var i = 0; i < this.prevPos.x.length; i++) {
      c.globalAlpha = 0.3 * (trailIntensity - i) / trailIntensity;
      c.fillStyle = secondaryColor;
      c.arc(this.prevPos.x[i], this.prevPos.y[i], this.radius, 0, Math.PI * 2, false);
      c.fill();
    }
    c.globalAlpha = 1;

    // hitbox
    // c.beginPath();
    // c.strokeStyle = "yellow";
    // c.rect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    // c.stroke();

    // estimate
    // c.beginPath();
    // c.fillStyle = "rgba(255,255,0,0.3)";
    // c.arc(this.estimate.x, this.estimate.y, this.radius, 0, Math.PI * 2, false);
    // c.fill();
  }

  estimatePos() {
    this.estimate.x = this.x;
    this.estimate.y = this.y;
    this.estimate.velocity.x = this.velocity.x;
    this.estimate.velocity.y = this.velocity.y;

    // simulate ball movement
    while (this.estimate.x + this.estimate.velocity.x - this.radius - 1> controllerOffset + cpu.width) {
      if ((this.estimate.y - this.radius) + this.estimate.velocity.y + 1 + this.hitbox.height > canvas.height - wallWidth ||
      (this.estimate.y - this.radius) + this.estimate.velocity.y + 1 < wallWidth) {
          this.estimate.velocity.y = -this.estimate.velocity.y;
      }
      this.estimate.x += this.estimate.velocity.x;
      this.estimate.y += this.estimate.velocity.y;
      
    }
    // offset ball
    if (gamemode === "classic") {
      this.estimate.x += (Math.random() * aiAccuracy) - (aiAccuracy / 2);
      this.estimate.y += (Math.random() * aiAccuracy) - (aiAccuracy / 2);
    }
  }
}

class Controller {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this. width = width;
    this.height = height;
    this.velocity = {
      x: 0,
      y: 0
    }
    this.color = color;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
    c.fill();
  }
}

// utility functions
function colided(x1, y1, width1, height1, x2, y2, width2, height2) {
  if (x1 + width1 > x2 &&
    x1 < x2 + width2 &&
    y1 + height1 > y2 &&
    y1 < y2 + height2) {
      return(true)
    } else {
      return (false);
    }
}

// functions
function updateScore() {
  if (gamemode === "classic") {
    cancelAnimationFrame(frame);

    playerScoreCounter.innerText = playerScore;
    cpuScoreCounter.innerText = cpuScore;
    if (playerScore === endAt || cpuScore === endAt) {
      endGame();
    } else if (titleContainer.style.display === "none") {
      setTimeout(init, pauseTime);
    }

  } else {
    playerScoreCounter.innerText = hits;
  }
}

function endGame() {
  // display ui
  gameOverContainer.style.top = "50%";
  gameOverContainer.style.transform = "translateY(-50%)";

  if (gamemode === "classic") {
    if (playerScore > cpuScore) {
      winnerText.innerText = "Player Wins!";
    } else {
      winnerText.innerText = "Computer Wins!";
    }
  } else {
    cancelAnimationFrame(frame);
    if (hits === 1) {
      winnerText.innerText = hits + " Return!";
    } else {
      winnerText.innerText = hits + " Returns!";
    }
  }
}

function moveCpu() {
  var verticalDistance = (cpu.y + (cpu.height / 2)) - ball.estimate.y;
  var time = (ball.x - ball.estimate.x) / ball.velocity.x;
  cpu.velocity.y = verticalDistance / time;
}

function init() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.fillStyle = primaryColor;
  c.fillRect(0, 0, canvas.width, wallWidth);
  c.fillRect(0, canvas.height, canvas.width, -wallWidth);

  ball = new Ball(canvas.width / 2, canvas.height / 2, ballSize, ballSpeed);
  cpu = new Controller(controllerOffset, wallWidth + 1, 10, controllerLength, primaryColor);
  player = new Controller(canvas.width - controllerOffset, wallWidth + 1, -10, controllerLength, primaryColor);

  hits = 0;

  ball.draw();
  cpu.draw();
  player.draw();

  fps.startTime = Date.now() + pauseTime;
  setTimeout(animate, pauseTime);
}
function animate() {
  frame = requestAnimationFrame(animate);

  // check FPS cap
  fps.elapsedTime = Date.now() - fps.startTime;
  if (fps.elapsedTime < fps.targetInterval) return;
  fps.startTime = Date.now();

  // begin loop
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  c.beginPath();
  c.fillStyle = primaryColor;
  c.fillRect(0, 0, canvas.width, wallWidth);
  c.fillRect(0, canvas.height, canvas.width, -wallWidth);

  // program AI
  // add stops
  if (cpu.y + cpu.velocity.y - 1 < wallWidth ||
    cpu.y + cpu.height + cpu.velocity.y + 1 > canvas.height - wallWidth ||
    (ball.x > 50 && ball.velocity.x > 0)) {
      cpu.velocity.y = 0;
  }

  // update objs
  ball.update();
  cpu.update();
  player.update();
  // player.y = ball.hitbox.y - player.height / 2;
}

// event listeners
addEventListener("mousemove", (event) => {
  if (titleContainer.style.display === "none") {
    // update player position and velocity
    if (event.clientY - (player.height / 2) + 1 <= wallWidth) {
      mouseVelocity = (wallWidth + 1) - player.y;
      player.y = wallWidth + 1;
    } else if (event.clientY + (player.height / 2) - 1 >= canvas.height - wallWidth) {
      mouseVelocity = (canvas.height - wallWidth - player.height - 1) - player.y;
      player.y = canvas.height - wallWidth - player.height - 1;
    } else {
      mouseVelocity = (event.clientY - (player.height / 2)) - player.y;
      player.y = event.clientY - (player.height / 2);
    }
  }
});

classicButton.addEventListener("click", () => {
  titleContainer.style.display = "none";
  cpuScoreCounter.style.display = "inline";
  gamemode = "classic";
  init();

  startSound.play()
});

endlessButton.addEventListener("click", () => {
  titleContainer.style.display = "none";
  cpuScoreCounter.style.display = "none";
  gamemode = "endless";
  init();
  startSound.play();
})

exitButton.addEventListener("click", () => {
  titleContainer.style.display = "block";
  gameOverContainer.classList.add("no-transition");
  gameOverContainer.style.top = "0";
  gameOverContainer.style.transform = "translateY(-100%)";
  setTimeout(() => {
    gameOverContainer.classList.remove("no-transition");
  }, 300);

  playerScore = 0;
  cpuScore = 0;
  hits = 0;
  updateScore();
  selectSounds[Math.floor(Math.random() * 2.9)].play();
});

restartButton.addEventListener("click", () => {
  gameOverContainer.style.top = "0";
  gameOverContainer.style.transform = "translateY(-100%)";

  setTimeout(() => {
    playerScore = 0;
    cpuScore = 0;
    hits = 0;
    updateScore();
    if (gamemode === "endless") {
      init();
    }
  }, 200);
  selectSounds[Math.floor(Math.random() * 2.9)].play();
});

// scroll protection

window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
}, false);

// launch screen
const launchScreen = document.querySelector('#launch-screen');
launchScreen.addEventListener('click', () => {
  if (launchScreen.classList.contains('hidden')) return
  launchScreen.classList.add('hidden');
  setTimeout(() => {
    launchScreen.parentNode.removeChild(launchScreen)
  }, 1000)
});