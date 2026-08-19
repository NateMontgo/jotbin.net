// images
let debugSquare;
let dungeon2Background;
let iceSlimeSprites;
let fireSlimeSprites;
let playerSprites;
let waterSlimeSprites;

let waterKingSlime;
let iceKingSlime;
let fireKingSlime;

let fireProjectileUpSprite;
let fireProjectileRightSprite;
let fireProjectileDownSprite;
let fireProjectileLeftSprite;

let iceProjectileUpSprite;
let iceProjectileRightSprite;
let iceProjectileDownSprite;
let iceProjectileLeftSprite;

let waterProjectileUpSprite;
let waterProjectileRightSprite;
let waterProjectileDownSprite;
let waterProjectileLeftSprite

let rolledUpScroll;
let openScroll;
let key;
let openChest;
let closedChest;

let fullHeart;
let fourHeart;
let fourAndAHalfHeart;
let threeHeart;
let threeAndAHalfHeart;
let twoHeart;
let twoAndAHalfHeart;
let oneHeart;
let oneAndAHalfHeart;
let zeroHeart;
let halfHeart;

let castleWithStatue;
let castleWithFountain;
let castleBasic;
let castleBoss;
let overworld;
let dungeon2Finished;
let dungeon1;

let dungeon1Cover;
let dungeon1Unlock;

let prisoner1dialogue;
let prisoner2dialogue;
let mcSecretCodeDialogue7;
let mcMyHeadDialogue1;
let mcIThinkDialogue6;
let mcINeedToDialogue5;
let mcHowDidDialogue3;
let mcAKeyDialogue4;
let catMewDialogue2;
let guard2LeaveDialogue;
let guard1LeaveDialogue;
let guard2PlayerCaughtDialogue;
let guard1PlayerCaughtDialogue;

let moveInstructions;
let magicInstructions;
let keyInstructions;
let gameOverScreen;
let tryAgain;
let quitButton;

let catPawForMaze;
let catSprite;

let guardSprites;

let temp;

let endGameImage = {image: null};

let black = document.querySelector('#black');
let dung = document.querySelector('#finald');
let credits = document.querySelector('#credits');
let white = document.querySelector('#white');

let castleMusic;
let titleMusic;
let overworldMusic;
let bossMusic;
let dungeonMusic;

let musicStuff = []

// consts
const gridSize = 25;
const canvasMultiplier = 2;

// vars
let canvas;
let c;
let currentAnimationId = -1;

let player;
let isGameOver = false;

let levels = [];
let levelIndex = -1;

let menuOpen = false;

let keysPressed = [false, false, false, false, false, false]; // up, right, down, left, c, space

let slimesCaught = 0;

// objects
let fps = {
    //* data used to limit framerate
    max: 60,        // fps
    lastFrame: 0,   // ms
    ellapsedTime: 0 //ms
}


// timeline functions

/**
 * Cancels current animation, sets all necessary vars to null, and initializes next scene
 * 
 * @param {Function} initScene initialization function of scene to change to
 */
function changeScene(initScene) {
    // cancel current animation
    cancelAnimationFrame(currentAnimationId);

    // set vars to null
    player = null;
    levelIndex = -1;
    menuOpen = false;

    // // remove event listeners
    // removeEventListener('keydown', onKeyDown);
    // removeEventListener('keyup', onKeyUp);

    // init next scene
    initScene();   
}



function init() {
    // init images
    debugSquare = document.querySelector('#debug-square'); 
    dungeon2Background = document.querySelector('#dungeon-2');
    iceSlimeSprites = document.querySelector('#ice-slime-sprites');
    fireSlimeSprites = document.querySelector('#fire-slime-sprites');
    playerSprites = document.querySelector('#player-sprites');
    waterSlimeSprites = document.querySelector('#water-slime-sprites');
    
    waterKingSlime = document.querySelector('#water-king-slime');
    iceKingSlime = document.querySelector('#ice-king-slime');
    fireKingSlime = document.querySelector('#fire-king-slime');

    fireProjectileUpSprite = document.querySelector('#fire-attack-up');
    fireProjectileRightSprite = document.querySelector('#fire-attack-right');
    fireProjectileDownSprite = document.querySelector('#fire-attack-down');
    fireProjectileLeftSprite = document.querySelector('#fire-attack-left');

    iceProjectileUpSprite = document.querySelector('#ice-projectile-up');
    iceProjectileRightSprite = document.querySelector('#ice-projectile-right');
    iceProjectileDownSprite = document.querySelector('#ice-projectile-down');
    iceProjectileLeftSprite = document.querySelector('#ice-projectile-left');

    waterProjectileUpSprite = document.querySelector('#water-attacks-up');
    waterProjectileRightSprite = document.querySelector('#water-attacks-right');
    waterProjectileDownSprite = document.querySelector('#water-attacks-down');
    waterProjectileLeftSprite = document.querySelector('#water-attacks-left');

    rolledUpScroll = document.querySelector('#rolledUp-scroll');
    openScroll = document.querySelector('#open-scroll');
    key = document.querySelector('#key');
    openChest = document.querySelector('#open-chest');
    closedChest = document.querySelector('#closed-chest');

    fullHeart = document.querySelector('#full-heart');
    fourHeart = document.querySelector('#four-heart');
    fourAndAHalfHeart = document.querySelector('#four-half-heart');
    threeHeart = document.querySelector('#three-heart');
    threeAndAHalfHeart = document.querySelector('#three-half-heart');
    twoHeart = document.querySelector('#two-heart');
    twoAndAHalfHeart = document.querySelector('#two-half-heart');
    oneHeart = document.querySelector('#one-heart');
    oneAndAHalfHeart = document.querySelector('#one-half-heart');
    zeroHeart = document.querySelector('#zero-heart');
    halfHeart = document.querySelector('#half-heart');

    castleWithStatue = document.querySelector('#castle-with-statue');
    castleWithFountain = document.querySelector('#castle-with-fountain');
    castleBasic = document.querySelector('#castle-basic');
    castleBoss = document.querySelector('#castle-boss');
    overworld = document.querySelector('#overworld');
    dungeon2Finished = document.querySelector('#dungeon-2-finished');
    dungeon1 = document.querySelector('#dungeon-1');

    dungeon1Cover = document.querySelector('#dungeon-1-cover');
    dungeon1Unlock = document.querySelector('#dungeon-1-unlock');

    prisoner1dialogue = document.querySelector('#prisoner-1-dialogue');
    prisoner2dialogue = document.querySelector('#prisoner-2-dialogue');
    mcSecretCodeDialogue7 = document.querySelector('#MC-secret-code-dialogue-7');
    mcMyHeadDialogue1 = document.querySelector('#MC-my-head-dialogue-1');
    mcIThinkDialogue6 = document.querySelector('#MC-I-think-dialogue-6');
    mcINeedToDialogue5 = document.querySelector('#MC-I-need-to-dialogue-5');
    mcHowDidDialogue3 = document.querySelector('#MC-how-did-dialogue-3');
    mcAKeyDialogue4 = document.querySelector('#MC-a-key-dialogue-4');
    catMewDialogue2 = document.querySelector('#cat-mew-dialogue-2');
    guard2LeaveDialogue = document.querySelector('#guard-2-leave-dialogue');
    guard1LeaveDialogue = document.querySelector('#guard-1-leave-dialogue');
    guard2PlayerCaughtDialogue = document.querySelector('#guard-2-player-caught-dialogue');
    guard1PlayerCaughtDialogue = document.querySelector('#guard-1-player-caught-dialogue');

    moveInstructions = document.querySelector('#move-instruct');
    magicInstructions = document.querySelector('#magic-instruct');
    keyInstructions = document.querySelector('#keys-instruct');
    gameOverScreen = document.querySelector('#game-over');
    tryAgain = document.querySelector('#try-again');
    quitButton = document.querySelector('#quit-button');

    catPawForMaze = document.querySelector('#cat-paw-for-maze');
    catSprite = document.querySelector('#cat-sprite');

    guardSprites = document.querySelector('#guard-sprites');

    castleMusic = document.querySelector('#castle-music');
    bossMusic = document.querySelector('#boss-music');
    overworldMusic = document.querySelector('#overworld-music');
    titleMusic = document.querySelector('#title-music');
    dungeonMusic = document.querySelector('#dungon-music');

    // init vars
    canvas = document.querySelector('canvas');
    c = canvas.getContext('2d');

    musicStuff = [dungeonMusic, dungeonMusic, overworldMusic, castleMusic, castleMusic, castleMusic, bossMusic, titleMusic]

    levels = [
        new Level(750, 500, dungeon2Background,
            [
                new SquareCollision(0, 100, 175, 600),
                new SquareCollision(610, 0, 200, 450),
                new SquareCollision(0, -25, 800, 25),
                new SquareCollision(0, 600, 800, 25),
                new SquareCollision(800, 0, 200, 600)
            ],
            [
                new FireSlime(200, 10),
                new FireSlime(300, 20),
                new FireSlime(390, 5),
                new FireSlime(450, 0)
            ],
            [
                new EventCollision(0, 0, 50, 100, () => {
                    initLevel(2);
                })
            ]
        ),
        new Level(470, 115, dungeon1,
            [
                new SquareCollision(0,0,315,200),
                new SquareCollision(0,290,325,180),
                
                new SquareCollision(450,0,25,100),
                new SquareCollision(450,100,25,50), //cell door
                
                new SquareCollision(450,-25,325,25),
                new SquareCollision(775,0,25,200),
                new SquareCollision(450,200,325,25),
                
                new SquareCollision(0,0,800,0),
                new SquareCollision(0,0,0,500),
                new SquareCollision(0,500,0,100), //prison door
                new SquareCollision(0,600,800,600),
                new SquareCollision(800,0,0,600),
    
            ],
            [
                new Guard(320, 290, 1),
                new Guard(720, 380, 3),
                new Cat(900, 0, 0)
            ],
            [
                new EventCollision(520, 0, 25, 60, () => {
                    levels[levelIndex].sprites[0].hidden = true;
                    levels[levelIndex].backgroundImage = dungeon1Unlock;
                    levels[levelIndex].collision.splice(3, 1);
                }, true),
                new EventCollision(735, 0, 40, 60, () => {
                    levels[levelIndex].actors[2].playPath(1);
                }, true),
                new EventCollision(0, 500, 15, 100, () => {
                    initLevel(0);
                })
            ],
            [
                new Sprite(key, 550, 30, 0.3),
                new Sprite(dungeon1Cover, 546, 6 , 1 / canvasMultiplier)
            ],
            () => {
                setTimeout(() => {
                    Utility.paused = true;
                    levels[levelIndex].actors[2].playPath(0);
                }, 2)


                setTimeout(() => {Dialog.trigger([keyInstructions, moveInstructions, magicInstructions], 100, -20)}, 3700);
            }
            ),
    
        new Level(550,500, overworld,
            [
                new SquareCollision(180, 0, 650, 35),
                new SquareCollision(186, 0, 50, 100),
                //new SquareCollision(186, 100, 60, 100), //hidden hedge path
                new SquareCollision(194, 200, 50, 400),
    
                //bottom
                new SquareCollision(180,600,800,600),
                //right
                new SquareCollision(800,0,800,600),
    
                //before pond
                new SquareCollision(186,200,300,40),
                new SquareCollision(476,200,40,70),
                new SquareCollision(580,200,300,40),
                new SquareCollision(770,0,30,200),
    
                //pond
                new SquareCollision(275,50,160,50),
    
                //bottom row of hedges
                new SquareCollision(310,490,220,5),
                new SquareCollision(600,490,220,5),
    
                //vertical hedges
                new SquareCollision(310,400,25,75),
                new SquareCollision(575,330,40,40),
                
                //other hedges
                new SquareCollision(310,365,250,5),
                new SquareCollision(675,320,75,15),
    
                //castle
                new SquareCollision(0,0,40,600),
                new SquareCollision(40,60,10,460),
                new SquareCollision(40,170,35,45),
    
                //new SquareCollision(40,230,45,130), //double doors for event collision later
            
                //top and bottom of the map
                new SquareCollision(0,0,800,0),
                new SquareCollision(0,600,800,600),
            ],
            [
                new WaterSlime(250, 120),
                new WaterSlime(650, 50),
                new WaterSlime(500, 140)
            ],
            [
                new EventCollision(40,230,45,130, () => {
                    initLevel(3);
                }),
            ], [
                new Sprite(catPawForMaze, 170, 100, 0.15)
            ]
                
        ),

        new Level(0, 250, castleBasic,
            [
                new SquareCollision(500, 0, 300, 150),
                new SquareCollision(0, 0, 300, 150),
                new SquareCollision(0, 393, 300, 230),
                new SquareCollision(500, 393, 300, 230),
                new SquareCollision(0, 200, 5, 195),
                
            ], 
            [],
            [
                //Cordinates for exits
                new EventCollision(795, 200, 5, 195, () => {
                    initLevel(3)
                }),
                new EventCollision(300, 595, 195, 5, () => {
                    initLevel(4)
                }),
                new EventCollision(300, 0, 195, 5, () => {
                    initLevel(3)
                })
            ]
        ),

        new Level(0, 250, castleWithStatue,
            [
                new SquareCollision(500, 0, 300, 150),
                new SquareCollision(0, 0, 300, 150),
                new SquareCollision(0, 393, 300, 230),
                new SquareCollision(500, 393, 300, 230),
                new SquareCollision(0, 200, 5, 195),
                new SquareCollision(350, 230, 100, 70),
                
            ], 
            [],
            [
                //Cordinates for exits
                new EventCollision(795, 200, 5, 195, () => {
                    initLevel(4)
                }),
                new EventCollision(300, 595, 195, 5, () => {
                    initLevel(4)
                }),
                new EventCollision(300, 0, 195, 5, () => {
                    initLevel(5)
                })
            ]
        ),

        new Level(0, 250, castleWithFountain,
            [
                new SquareCollision(500, 0, 300, 150),
                new SquareCollision(0, 0, 300, 150),
                new SquareCollision(0, 393, 300, 230),
                new SquareCollision(500, 393, 300, 230),
                new SquareCollision(0, 200, 5, 195),
                new SquareCollision(340, 270, 120, 30),
                new SquareCollision(380, 230, 50, 30),
                
            ],
            [],
            [
                                //Cordinates for exits
                new EventCollision(795, 200, 5, 195, () => {
                    initLevel(5)
                }),
                new EventCollision(300, 595, 195, 5, () => {
                    initLevel(5)
                }),
                new EventCollision(300, 0, 195, 5, () => {
                    initLevel(6)
                })
            ]
        ),

        new Level(380, 520, castleBoss,
            [
                new SquareCollision(0, 0, 5, 600),
                new SquareCollision(10, 0, 800, 5),
                new SquareCollision(0, 600, 600, 5),
                new SquareCollision(790, 0, 5, 600)
            ],
            [
                new FireSlime(30, 10),
                new IceSlime(80, 10),
                new WaterSlime(150, 10),
                new FireSlime(180, 10),
                new IceSlime(210, 10),
                new WaterSlime(280, 10),
                new KingSlime(300, 50)
            ]
        )
    ];  

    changeScene(() => {initLevel(1)});
}


let x = gsap.timeline().
set(endGameImage, {image: white, delay: 0.15}).
set(endGameImage, {image: black, delay: 0.15}).
set(endGameImage, {image: white, delay: 0.15}).
set(endGameImage, {image: black, delay: 0.15}).
set(endGameImage, {image: white, delay: 0.15}).
set(endGameImage, {image: black, delay: 0.15}).
set(endGameImage, {image: dung, delay: 0.15}).
set(endGameImage, {image: credits, delay: 5})

x.pause();

function initEndGame() {
    for (const music of musicStuff) {
        music.pause();
    }

    musicStuff[7].loop = true;
    musicStuff[7].play();

    x.play();


    animateEndGame()
}

function animateEndGame() {
    requestAnimationFrame(animateEndGame);

    c.drawImage(endGameImage.image, 0, 0, canvas.width, canvas.height);
}

function initLevel(level) {
    // init vars
    levelIndex = level;

    //! cheap workaround to stop health from resetting every level
    if (player !== null) {
        let health = player.health;
        player = new Player(levels[level].playerSpawnX, levels[level].playerSpawnY);
        player.health = health;
    } else {
        player = new Player(levels[level].playerSpawnX, levels[level].playerSpawnY);
    }

    // init event listeners
    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);
    addEventListener('click', onClick);

    levels[levelIndex].restart();
    animateLevel();

    for (const music of musicStuff) {
        music.pause();
    }

    musicStuff[level].loop = true;
    musicStuff[level].play();
}

function animateLevel() {
    currentAnimationId = requestAnimationFrame(animateLevel);
    if (isGameOver) return;

    // check fps cap
    fps.ellapsedTime = Date.now() - fps.lastFrame;
    if (fps.ellapsedTime < 1000 / fps.max) return;
    fps.lastFrame = Date.now();

    // clear canvas
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // update objects
    if (!isGameOver) {
        levels[levelIndex].update();
        player.update();
    }
}
let count = 0;
function initGameOver() {
    if (isGameOver) return;
    
    isGameOver = true;

    Dialog.trigger([gameOverScreen], 0, 0, 0.5, () => {
        temp = levelIndex;
        changeScene(() => {initLevel(temp)});
        isGameOver = false;
    });
}

// function animateGameOver() {
//     currentAnimationId = requestAnimationFrame(animateGameOver);

//     c.drawImage(gameOverScreen, 0, 0, canvas.width, canvas.height);
// }

// event functions
function onKeyDown(event) {
    event.preventDefault();

    //console.log(event.keyCode);
    switch (event.keyCode) {
        case 16: // shift
            if (player) player.currentSprint = player.sprintConst;
            break;
        case 38: // up
            if (Utility.paused) break;
            keysPressed[0] = true;
            if (player) {
                player.dy = -1;
                if (player.animationIndex == 6 || player.animationIndex < 4) player.animationIndex = 4;
            }
            break;
        case 39: // right
            if (Utility.paused) break;
            keysPressed[1] = true;
            if (player) {
                player.dx = 1;
                if (player.animationIndex == 7 || player.animationIndex < 4) player.animationIndex = 5;
            }
            break;
        case 40: // down
            if (Utility.paused) break;
            keysPressed[2] = true;
            if (player) {
                player.dy = 1;
                if (player.animationIndex <= 4) player.animationIndex = 6;
            }
            break;
        case 37: // left
            if (Utility.paused) break;
            keysPressed[3] = true;
            if (player) {
                player.dx = -1;
                if (player.animationIndex == 5 || player.animationIndex < 4) player.animationIndex = 7;
            }
            break;
        case 88: // x
            if (player) player.attacking = true;
            break;
        case 67: // c
            if (!keysPressed[4]) {
                keysPressed[4] = true;
                if (player) {
                    player.attackType++;
                    if (player.attackType > 2) player.attackType = 0;
                }
            }
            break;
        case 32: // space
            if (!keysPressed[5]) {
                keysPressed[5] = true;
                Dialog.advance();
            }
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 16: // shift
            if (player) player.currentSprint = 1;
            break;
        case 38: // up
            keysPressed[0] = false;
            if (player && keysPressed[2]) {
                player.dy = 1;
                if (player.animationIndex <= 4) player.animationIndex = 6;
            }
            break;
        case 39: // right
            keysPressed[1] = false;
            if (player && keysPressed[3]) {
                player.dx = -1;
                if (player.animationIndex == 5 || player.animationIndex < 4) player.animationIndex = 7;
            }
            break;
        case 40: // down
            keysPressed[2] = false;
            if (player && keysPressed[0]) {
                player.dy = -1;
                if (player.animationIndex == 6 || player.animationIndex < 4) player.animationIndex = 4;
            }
            break;
        case 37: // left
            keysPressed[3] = false;
            if (player && keysPressed[1]) {
                player.dx = 1;
                if (player.animationIndex == 7 || player.animationIndex < 4) player.animationIndex = 5;
            }
            break;
        case 88: // x
            if (player) {
                player.attacking = false;
                player.prevAttackTime = -1;
            }
            break;
        case 67: // c
            keysPressed[4] = false;
        case 32: // space
            keysPressed[5] = false;
    }

    if (player && !keysPressed[0] && !keysPressed[2]) {
        player.dy = 0;

        if (keysPressed[1] && !keysPressed[3]) {
            player.animationIndex = 5;
        } else if (keysPressed[3] && !keysPressed[1]) {
            player.animationIndex = 7;
        }
    }
    if (player && !keysPressed[1] && !keysPressed[3]) {
        player.dx = 0;
        
        if (keysPressed[0] && !keysPressed[2]) {
            player.animationIndex = 4;
        } else if (keysPressed[2] && !keysPressed[0]) {
            player.animationIndex = 6;
        }
    }
    if (player && player.dx == 0 && player.dy == 0) {
        switch (player.animationIndex) {
            case 4:
                player.animationIndex = 0;
                break;
            case 5:
                player.animationIndex = 1;
                break;
            case 6:
                player.animationIndex = 2;
                break;
            case 7:
                player.animationIndex = 3;
                break;
        }
    }

}

function onClick() {
    musicStuff[levelIndex].loop = true;
    musicStuff[levelIndex].play();
}

// other functions