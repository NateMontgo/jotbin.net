// doc setup
const mainContainer = document.querySelector('main');

const titleScreen = document.querySelector('#title-container');
const playButton = document.querySelector('#play-button');
const menuBackButton = document.querySelector('#menu-back-button');
const sfxVolumeInput = document.querySelector('#sfx-volume');
const musicVolumeInput = document.querySelector('#music-volume');
const levelSelectButtons = document.querySelectorAll('.level-select-button');

const gameContainer = document.querySelector('#game-container');
const levelLabel = document.querySelector('#level-label');
const ingameExitButton = document.querySelector('#ingame-exit-button');
const ingameRestartButton = document.querySelector('#ingame-restart-button');
const ingameGenerateButton = document.querySelector('#ingame-new-level-button');
const tutSolved = document.querySelector('#tut-solved');
const tutArrows = document.querySelector('#tut-arrows');

const transitionDiv = document.querySelector('#transition-effect');

const victoryScreen = document.querySelector('#victory-container');
const victoryExitButton = document.querySelector('#victory-exit-button');
const victoryRestartButton = document.querySelector('#victory-restart-button');
const victoryNextButton = document.querySelector('#victory-next-button');

const completeVictoryScreen = document.querySelector('#complete-victory-container');
const completeVictoryButton = document.querySelector('#complete-victory-button');

const canvas = document.querySelector('#game');
const c = canvas.getContext('2d');

// consts
const tileSpacing = 2;
const bubbleSpawnSpeed = 500;
const bubbleColors = [
  "#3098FF",
  "#1687F7",
  "#409FFF"
];
const tutLevels = 3;
const dpr = devicePixelRatio;

// vars
let gridOffsetX;
let gridOffsetY;

let localStorageSupport = false;
let transitioning = false;
let tiles = [];
let backgroundBubbles = [];
let emptySpace = {
  x: 0,
  y: 0
}
let currentLevel = 0;
let levelsCompleted = 0;
let gameComplete = false;

// size parameters
class sizeParameter {
  constructor(value, widthPercentage, heightPercentage) {
    this.value = value;
    this.widthPercentage = widthPercentage;
    this.heightPercentage = heightPercentage;
  }
}

let tileSize = new sizeParameter(100, 0.15, 0.167);
let tileSpeed = new sizeParameter(20, 0.03, 0.033);
let tileFontSize = new sizeParameter(50, 0.074, 0.083);
let gridBackgroundPadding = new sizeParameter(20, 0.03, 0.033);
let bubbleMinRadius = new sizeParameter(10, 0.012, 0.017);
let bubbleMaxRadius = new sizeParameter(50, 0.062, 0.083);
let initBubbleCount = new sizeParameter(16, 0.02, 0.027);
let tutSolvedOffset = new sizeParameter(220, null, 0.366);
let tutArrowsOffset = new sizeParameter(250, null, 0.416);

// other objects
let fps = {
  cap: 1000 / 65, // ms / fps
  startTime: 0,
  elapsedTime: 0
}

let prevTouch = {
  x: -1,
  y: -1,
  direction: null,
  sensitivity: 0.2 // amount of screen width
}

let sfx = {
  ost: new Audio('./audio/ost.mp3'),
  click: new Audio('./audio/click.mp3'),
  back: new Audio('./audio/back.mp3'),
  victory: new Audio('./audio/victory.mp3'),
  slide: [
    new Audio('./audio/slide1.mp3'),
    new Audio('./audio/slide2.mp3'),
    new Audio('./audio/slide3.mp3')
  ],

  overlapSound(origSound) {
    const newSound = origSound.cloneNode();
    newSound.volume = origSound.volume;
    newSound.play();
  },
  playRandom(soundList, overlap) {
    if (overlap) {
      this.overlapSound(soundList[Math.floor(Math.random() * soundList.length)]);
    } else {
      soundList[Math.floor(Math.random() * soundList.length)].play();
    }
  }
}

let sinWave = {
  velocity: 0.04,
  intensity: 8,
  fx: 5,
  x: 5
}

let levelCore = {
  status: null,
  generatorMoveCount: 150,

  levels: [
    // Level 1
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15],
    // Level 2
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 11, 13, 14, 0, 12],
    // Level 3
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 13, 14, 0],
    // Level 4
    [1, 2, 3, 4, 5, 7, 12, 10, 9, 14, 8, 0, 13, 11, 6, 15],
    // Level 5
    [5, 1, 3, 4, 13, 2, 11, 7, 0, 6, 15, 10, 14, 9, 8, 12],
    // Level 6
    [1, 3, 8, 7, 0, 6, 12, 4, 13, 14, 2, 15, 5, 9, 10, 11],
    // Level 7
    [1, 7, 11, 3, 5, 6, 14, 0, 10, 12, 8, 2, 9, 13, 15, 4],
    // Level 8
    [5, 3, 11, 8, 2, 7, 4, 10, 6, 1, 15, 12, 13, 9, 14, 0],
    // Level 9
    [3, 5, 6, 4, 0, 13, 11, 7, 15, 2, 8, 12, 14, 9, 1, 10],
    // Level 10
    [10, 6, 5, 4, 2, 0, 1, 8, 9, 15, 12, 11, 13, 14, 7, 3],
    // Level 11
    [1, 5, 8, 11, 4, 10, 0, 6, 9, 12, 3, 15, 13, 2, 14, 7],
    // Level 12
    [8, 13, 7, 14, 10, 2, 0, 5, 4, 15, 12, 6, 1, 3, 9, 11],
    // Level 13
    [9, 14, 5, 7, 11, 1, 15, 3, 4, 0, 10, 8, 13, 6, 2, 12],
    // Level 14
    [10, 6, 14, 4, 11, 7, 2, 0, 1, 5, 8, 13, 9, 15, 3, 12],
    // Level 15
    [14, 2, 6, 15, 7, 12, 0, 4, 5, 10, 1, 9, 13, 8, 11, 3],
    // Level 16
    [0],
    // Level 17
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
  ],

  load(levelId) {
    tiles = [];
    for (i = 0; i < this.levels[levelId].length; i++) {
      if (this.levels[levelId][i] === 0) {
        emptySpace.x = i - (Math.floor(i / 4) * 4);
        emptySpace.y = Math.floor(i / 4);
      } else {
        tiles.push(new Tile(i - (Math.floor(i / 4) * 4), Math.floor(i / 4), this.levels[levelId][i]));
      }
    }
    if (levelId === 15) {
      levelLabel.innerText = "";
      ingameGenerateButton.style.display = 'inline';
    } else if (levelId === 16) {
      levelLabel.innerText = "Free Play";
      ingameGenerateButton.style.display = 'none';
    } else {
      levelLabel.innerText = "Level " + (currentLevel + 1);
      ingameGenerateButton.style.display = 'none';
    }

    if (levelId < tutLevels) {
      tutArrows.style.display = 'block';
      tutSolved.style.display = 'block';
    } else {
      tutArrows.style.display = 'none';
      tutSolved.style.display = 'none';
    }
  },

  generate() {
    this.status = 'generating';
    // Load tiles
    tiles = [];
    for (var i = 0; i < 15; i++) {
      tiles.push(new Tile(i - (Math.floor(i / 4) * 4), Math.floor(i / 4), i + 1));
    }
    emptySpace.x = 3;
    emptySpace.y = 3;

    // Scramble Tiles
    for (var i = 0; i < this.generatorMoveCount; i++) {
      var move = Math.floor(Math.random() * 4);
      switch (move) {
        case 0:
          moveTile('up');
          break;
        case 1:
          moveTile('right');
          break;
        case 2:
          moveTile('down');
          break;
        case 3:
          moveTile('left');
          break;
      }
    }
    tiles.forEach(element => {
      element.x = (element.gridX * tileSize.value) + (element.gridX * tileSpacing) + gridOffsetX;
      element.y = (element.gridY * tileSize.value) + (element.gridY * tileSpacing) + gridOffsetY;
    });
    // Save Level
    this.levels[15][(emptySpace.y * 4) + emptySpace.x] = 0;
    tiles.forEach(element => {
      this.levels[15][(element.gridY * 4) + element.gridX] = element.value;
    });
    levelLabel.innerText = "";
    ingameGenerateButton.style.display = 'inline';
    this.status = 'idle';
  }
}

class  Tile {
  constructor(gridX, gridY, value) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = (gridX * tileSize.value) + (gridX * tileSpacing) + gridOffsetX;
    this.y = (gridY * tileSize.value) + (gridY * tileSpacing) + gridOffsetX;
    this.arcSize = 10;
    this.value = value;
    this.color = "#942D51";

    this.update = () => {
      // check if literal x/y and grid x/y match.  If not, adjust coords
      // move up
      if (this.y > (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY) {
        if (this.y - tileSpeed.value < (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY) {
        this.y = (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY;
        } else {
          this.y -= tileSpeed.value;
        }
      // move right
      } else if (this.x < (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX) {
        if (this.x + tileSpeed.value > (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX) {
          this.x = (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX;
        } else {
          this.x += tileSpeed.value;
        }
      // move down
      } else if (this.y < (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY) {
        if (this.y + tileSpeed.value > (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY) {
          this.y = (this.gridY * tileSize.value) + (this.gridY * tileSpacing) + gridOffsetY;
        } else {
          this.y += tileSpeed.value;
        }
      // move left
      } else if (this.x > (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX) {
        if (this.x - tileSpeed.value < (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX) {
          this.x = (this.gridX * tileSize.value) + (this.gridX * tileSpacing) + gridOffsetX;
        } else {
          this.x -= tileSpeed.value;
        }
      }
      this.draw();
    }
    this.draw = () => {
      c.beginPath();
      c.fillStyle = this.color;
      roundedRect(c, this.x, this.y, tileSize.value, tileSize.value, this.arcSize);
      c.fill();
      c.fillStyle = "white";
      c.font = `${tileFontSize.value}px Sans-serif`;
      c.textBaseline = "middle";
      c.textAlign = "center";
      c.fillText(this.value, this.x + (tileSize.value / 2), this.y + (tileSize.value / 2));
      c.closePath();
    }
  }
}
class BackgroundBubble {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 0.1;
    this.dy = 1.5;

    this.update = () => {
      if (this.y < 0 - this.radius) {
        setTimeout(() => {
          backgroundBubbles.splice(backgroundBubbles.indexOf(this), 1);
        }, 0)
      }
      this.x += this.dx;
      this.y -= this.dy;

      this.draw();
    }
    
    this.draw = () => {
      c.beginPath();
      c.fillStyle = this.color;
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fill();
      c.closePath();
    }
  }
}

// utility functions
function roundedRect(ctx, x, y, width, height, radius) {
  // function made by Smoggy Skipper on Grepper
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
}

function transition(callBack, timeout) {
  if (!transitioning) {
    transitioning = true;
    transitionDiv.style.width = 'inherit';
    setTimeout(callBack, 400);
    setTimeout(() => {
      transitionDiv.style.margin = '0 0 0 ' + canvas.width + 'px';
    }, timeout + 400);
    // reset
    setTimeout(() => {
      transitionDiv.style.transition = 'none';
      transitionDiv.style.width = 0;
      transitionDiv.style.margin = 0;
      setTimeout(() => {
        transitionDiv.style.transition = 'all 0.4s';
        transitioning = false;
      }, 100);
    }, 800 + timeout);
  }
}

// functions
//   General
function evaluate() {
  let correct = true;
  tiles.forEach(element => {
    if (element.value !== (element.gridY * 4) + (element.gridX + 1)) {
      correct = false;
    }
  });
  if (correct === true) {
    sfx.victory.play();
    if (currentLevel !== 16) {
      endGame();
    }
  }
}

function endGame() {
  // update levels completed
  if (currentLevel + 1> levelsCompleted && currentLevel !== 15) {
    levelsCompleted = currentLevel + 1;
    localStorage.setItem('level', levelsCompleted.toString());
  }
  // hide buttons based off level
  if (currentLevel === 14) {
    victoryNextButton.style.display = 'none';
  } else {
    victoryNextButton.style.display = 'block';
  }
  // display screen
  victoryScreen.style.top = 0;
  levelCore.status = 'victory';
}

function resizeSizeParameters(sizeParameters) {
  // if device is mobile, rezise main containers.  Then set value of each size parameter to it's proper screen percentage
  if (innerWidth < 800) {
    canvas.width = innerWidth * dpr;
    canvas.style.width = `${innerWidth}px`;
  } else {
    canvas.width = 800 * dpr;
    canvas.style.width = '800px';
  }
  if (innerHeight < 600) {
    canvas.height = innerHeight * dpr;
    canvas.style.height = `${innerHeight}px`;
  } else {
    canvas.height = 600 * dpr;
    canvas.style.height = '600px';
  }
  c.setTransform(dpr, 0, 0, dpr, 0, 0);

  sizeParameters.forEach((element) => {
    if (canvas.height > canvas.width) {
      element.value = canvas.width / dpr * element.widthPercentage;
    } else {
      element.value = canvas.height / dpr * element.heightPercentage;
    }
  });

  // hardcoded
  gridOffsetX = (canvas.width / dpr / 2) - (tileSpacing * 1.5) - (tileSize.value * 2);
  gridOffsetY = (canvas.height / dpr / 2) - (tileSpacing * 1.5) - (tileSize.value * 2);
  if (canvas.width < canvas.height) {
    tutSolvedOffset.value = gridOffsetY + (canvas.height / dpr * 0.05) + (tileSize.value * 4) + (tileSpacing * 3) + gridBackgroundPadding.value;
  }

  // update tiles
  tiles.forEach(element => {
    element.x = (element.gridX * tileSize.value) + (element.gridX * tileSpacing) + gridOffsetX;
    element.y = (element.gridY * tileSize.value) + (element.gridY * tileSpacing) + gridOffsetY;
  });
}

function moveTile(direction) {
  // looks at each tile's coords and moves correct tile in it's desired direction
  switch (direction) {
    case 'up':
      if (emptySpace.y >= 3) return;
      tiles.forEach(element => {
        if (element.gridY === emptySpace.y + 1 && element.gridX === emptySpace.x) {
          element.gridY--;
        }
      });
      emptySpace.y++;
      break;
    case 'right':
      if (emptySpace.x <= 0) return;
      tiles.forEach(element => {
        if (element.gridX === emptySpace.x - 1 && element.gridY === emptySpace.y) {
          element.gridX++;
        }
      });
      emptySpace.x--;
      break;
    case 'down':
      if (emptySpace.y <= 0) return;
      tiles.forEach(element => {
        if (element.gridY === emptySpace.y - 1 && element.gridX === emptySpace.x) {
          element.gridY++;
        }
      });
      emptySpace.y--;
      break;
    case 'left':
      if (emptySpace.x >= 3) return
      tiles.forEach(element => {
        if (element.gridX === emptySpace.x + 1 && element.gridY === emptySpace.y) {
          element.gridX--;
        }
      });
      emptySpace.x++;
      break;
  }
  if (levelCore.status === 'generating' ||
  innerWidth < 600 ||
  innerHeight < 600) return;
  sfx.playRandom(sfx.slide, true);
}

function init() {
  // spawn starting bubbles
  for (let i = 0; i < initBubbleCount.value; i++) {
    let radius = (Math.random() * (bubbleMaxRadius.value - bubbleMinRadius.value)) + bubbleMinRadius.value;
    let x = Math.floor(Math.random() * canvas.width);
    let y = i * (canvas.height / initBubbleCount.value);
    let color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

    backgroundBubbles.push(new BackgroundBubble(x, y, radius, color));
  }

  setInterval(() => {
    // only execute no bubbles offscreen (removes bubble "clump" effect)
    if (backgroundBubbles[backgroundBubbles.length - 1].y < canvas.height + backgroundBubbles[backgroundBubbles.length - 1].radius) {
      let radius = (Math.random() * (bubbleMaxRadius.value - bubbleMinRadius.value)) + bubbleMinRadius.value;
      let x = Math.random() * canvas.width;
      let y = canvas.height + radius;
      let color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    
      backgroundBubbles.push(new BackgroundBubble(x, y, radius, color));
    }
  }, bubbleSpawnSpeed);

  // read local storage
  localStorage
  if (typeof(Storage) !== "undefined") {
      localStorageSupport = true;
    if (localStorage.getItem('level') !== null) {
      levelsCompleted = parseInt(localStorage.getItem('level'));
    }
    if (localStorage.getItem('complete') !== null) {
      gameComplete = JSON.parse(localStorage.getItem('complete').toLowerCase());
    } else {
      localStorage.setItem('complete', 'false');
    }
  }

  levelSelectButtons.forEach(element => {
    if (levelsCompleted === 15 || element.innerText <= levelsCompleted + 1) {
      element.style.opacity = '100%';
    }
  });

  if (sfx.ost.canPlayType('audio/ogg')) {
    sfx.ost.src = './audio/ost.ogg';
  }
  sfx.ost.loop = true;
  sfx.ost.play();
  levelCore.status = 'title';
  resizeSizeParameters([tileSize, tileSpeed, tileFontSize, gridBackgroundPadding, bubbleMinRadius, bubbleMaxRadius, initBubbleCount, tutSolvedOffset, tutArrowsOffset]);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  // check fps cap
  fps.elapsedTime = Date.now() - fps.startTime;
  if (fps.elapsedTime <= fps.cap) return;
  fps.startTime = Date.now();

  // draw background
  c.fillStyle = "#086DAB";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundBubbles.forEach(element => {
    element.update();
  });

  // draw foreground if in game
  if (levelCore.status === 'idle' || levelCore.status === 'victory') {
    c.beginPath();
    c.fillStyle = "#0A0B6B"
    roundedRect(c, gridOffsetX - gridBackgroundPadding.value, gridOffsetY - gridBackgroundPadding.value, (gridBackgroundPadding.value * 2) + (tileSize.value * 4) + (tileSpacing * 3), (gridBackgroundPadding.value * 2) + (tileSize.value * 4) + (tileSpacing * 3), 20);
    c.fill();
    c.closePath();
    tiles.forEach(element => {
      element.update();
    });
  }

  // update title and tutorial animation
  if (levelCore.status === 'title' || tutSolved.style.display === 'block') {
    sinWave.x += sinWave.velocity;
    sinWave.fx = (Math.sin(sinWave.x) * sinWave.intensity) + sinWave.intensity;

    titleScreen.style.top = sinWave.fx + 'px';
    tutSolved.style.top = (tutSolvedOffset.value + sinWave.fx) + 'px';
    tutArrows.style.top = (tutArrowsOffset.value + sinWave.fx) + 'px';
  }
}

// event listeners
addEventListener('keydown', (event) => {
  if (levelCore.status === 'idle') {
    if (event.key === 'w' || event.key === 'ArrowUp') { 
      moveTile('up');
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
      moveTile('right');
    } else if (event.key === 's' || event.key === 'ArrowDown') {
      moveTile('down');
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
      moveTile('left');
    } else {
      return;
    }
    evaluate();
  }
});

addEventListener('touchstart', (event) => {
  event.preventDefault();
  prevTouch.x = event.touches[0].pageX;
  prevTouch.y = event.touches[0].pageY;
}, { passive: false });

addEventListener('touchmove', (event) => {
  if (levelCore.status !== 'idle') return;
  let touchThreshold;

  event.preventDefault();

  if (canvas.width > canvas.height) {
    touchThreshold = prevTouch.sensitivity * innerHeight;
  } else {
    touchThreshold = prevTouch.sensitivity * innerWidth;
  }

  if (Math.abs(event.touches[0].pageX - prevTouch.x) > touchThreshold ||
    Math.abs(event.touches[0].pageY - prevTouch.y) > touchThreshold) {
    if (Math.abs(event.touches[0].pageX - prevTouch.x) > Math.abs(event.touches[0].pageY - prevTouch.y)) {
      // move X
      if (event.touches[0].pageX > prevTouch.x && prevTouch.direction !== 'right') {
        prevTouch.direction = 'right';
        moveTile('right');
      } else if (event.touches[0].pageX < prevTouch.x && prevTouch.direction !== 'left') {
        prevTouch.direction = 'left';
        moveTile('left');
      }
    } else {
      // move Y
      if (event.touches[0].pageY > prevTouch.y && prevTouch.direction !== 'down') {
        prevTouch.direction = 'down';
        moveTile('down');
      } else if (event.touches[0].pageY < prevTouch.y && prevTouch.direction !== 'up') {
        prevTouch.direction = 'up';
        moveTile('up');
      }
    }
    prevTouch.x = event.touches[0].pageX
    prevTouch.y = event.touches[0].pageY

    evaluate();
  }
}, { passive: false });

addEventListener('touchend', (event) => {
  event.preventDefault();
  prevTouch.x = -1;
  prevTouch.y = -1;
  prevTouch.direction = null;
}, { passive: false });

addEventListener('resize', () => {
  resizeSizeParameters([tileSize, tileSpeed, tileFontSize, gridBackgroundPadding, bubbleMinRadius, bubbleMaxRadius, initBubbleCount, tutSolvedOffset, tutArrowsOffset]);
});

addEventListener('orientationchange', () => {
  resizeSizeParameters([tileSize, tileSpeed, tileFontSize, gridBackgroundPadding, bubbleMinRadius, bubbleMaxRadius, initBubbleCount, tutSolvedOffset, tutArrowsOffset]);
});

playButton.addEventListener('click', () => {
  sfx.overlapSound(sfx.click);
  titleScreen.style.left = '-100%';
});

menuBackButton.addEventListener('click', () => {
  titleScreen.style.left = 0;
  if (innerWidth < 600 ||
  innerHeight < 600) return;
  sfx.overlapSound(sfx.back);
});

sfxVolumeInput.addEventListener('change', () => {
  sfx.click.volume = sfxVolumeInput.value / 100;
  sfx.back.volume = sfxVolumeInput.value / 100;
  sfx.victory.volume = sfxVolumeInput.value / 100;
  sfx.slide.forEach(element => {
    element.volume = sfxVolumeInput.value / 100;
  });

  sfx.overlapSound(sfx.click);
});

musicVolumeInput.addEventListener('change', () => {
  sfx.ost.volume = musicVolumeInput.value / 100;
});

levelSelectButtons.forEach(element => {
  element.addEventListener('click', () => {
    sfx.overlapSound(sfx.click);
    if (element.style.opacity === '1') {
      transition(() => {
        titleScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        if (element.innerText === 'Free Play') {
          currentLevel = 16;
          levelCore.load(currentLevel);
        } else if (element.innerText === 'Random') {
          currentLevel = 15;
          tutArrows.style.display = 'none';
          tutSolved.style.display = 'none';
          levelCore.generate();
        } else {
          currentLevel = parseInt(element.innerText) - 1;
          levelCore.load(currentLevel);
        }
        levelCore.status = 'idle';
      }, 200);
    }
  });
});

ingameExitButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.back);
  transition(() => {
    titleScreen.style.display = 'flex';
    gameContainer.style.display = 'none';
    levelSelectButtons.forEach(element => {
      if (levelsCompleted === 15 || element.innerText <= levelsCompleted + 1) {
        element.style.opacity = '100%';
      }
    });
    if (levelsCompleted === 15 && gameComplete === false) {
      completeVictoryScreen.style.transition = 'none';
      completeVictoryScreen.style.top = 0;
      gameComplete = true;
      localStorage.setItem('complete', 'true');
      setTimeout(() => {
        completeVictoryScreen.style.transition = 'all 0.7s';
      }, 100);
    }
    levelCore.status = 'title';
  }, 200)
});

ingameRestartButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.back);
  transition(() => {levelCore.load(currentLevel)}, 200);
});

ingameGenerateButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.click);
  transition(() => {levelCore.generate()}, 200);
});

victoryExitButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.back);
  transition(() => {
    titleScreen.style.display = 'flex';
    gameContainer.style.display = 'none';
    victoryScreen.style.transition = 'none';
    victoryScreen.style.top = '-100%';
    levelSelectButtons.forEach(element => {
      if (levelsCompleted === 15 || element.innerText <= levelsCompleted + 1) {
        element.style.opacity = '100%';
      }
    });
    if (levelsCompleted === 15 && gameComplete === false) {
      completeVictoryScreen.style.transition = 'none';
      completeVictoryScreen.style.top = 0;
      gameComplete = true;
      localStorage.setItem('complete', 'true');
      setTimeout(() => {
        completeVictoryScreen.style.transition = 'all 0.7s';
      }, 100);
    }
    sfx.victory.load();
    levelCore.status = 'title';
    setTimeout(() => {
      victoryScreen.style.transition = 'all 0.7s';
    }, 100);
  }, 200)
});

victoryNextButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.click);
  // Updating completed levels moved to endGame. Update / load current level
  transition(() => {
    victoryScreen.style.transition = 'none';
    victoryScreen.style.top = '-100%';
    
    if (currentLevel === 15) {
      levelCore.generate();
    } else {
      currentLevel++;
      levelCore.load(currentLevel);
    }

    sfx.victory.load();
    levelCore.status = 'idle';
    setTimeout(() => {
      victoryScreen.style.transition = 'all 0.7s';
    }, 100);
  }, 200);
});

victoryRestartButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.back);
  transition(() => {
    victoryScreen.style.transition = 'none';
    victoryScreen.style.top = '-100%';
    levelCore.load(currentLevel);
    sfx.victory.load();
    levelCore.status = 'idle';
    setTimeout(() => {
      victoryScreen.style.transition = 'all 0.7s';
    }, 100);
  }, 200);
});

completeVictoryButton.addEventListener('click', () => {
  if (transitioning) return;
  sfx.overlapSound(sfx.click);
  completeVictoryScreen.style.top = '-100%';
});

sfx.ost.addEventListener('timeupdate', () => {
  if (sfx.ost.currentTime > sfx.ost.duration - 1) {
    sfx.ost.currentTime = 0;
    sfx.ost.play();
  }
});

addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    sfx.ost.pause();
  } else if (levelCore.status !== null) {
    sfx.ost.play();
  }
})

// scroll protection

window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
}, false);

// FastClick

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}

// launch screen
const launchScreen = document.querySelector('#launch-screen');
launchScreen.addEventListener('click', () => {
  if (launchScreen.classList.contains('hidden')) return
  launchScreen.classList.add('hidden');
  init();
  setTimeout(() => {
    launchScreen.parentNode.removeChild(launchScreen)
  }, 1000)
});
