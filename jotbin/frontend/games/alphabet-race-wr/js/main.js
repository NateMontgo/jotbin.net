
// consts
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const font = 'arial';

const validStates = ['idle', 'game', 'results']

const wr = 3250 // ms

// lets
let currentState = "idle"

// objects
const alphabet = {
    string: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
    textWidth: 0,                           // calculated in resizeHandler
    fontScale: 0.05,
    completionIndex: 0,
    primaryColor: '#FFFFFF',
    secondaryColor: '#FFD700'
}

const stopwatch = {
    initTime: 0,            //ms
    elapsedTime: 0,         //ms
    textWidth: 0,           // calculated in resizeHandler
    fontScale: 0.1,
    primaryColor: '#FFFFFF'
}

const leaderboard = {
    data: null,
    textWidth: 0,
    fontScale: 0.04,
    yMargin: 0.035,
    yPadding: 0.002,
    primaryColor: '#FFFFFF'
}

const highScoreUI = {
    name: '',
    nameScale: 0.2,
    maxNameLength: 10,
    label1: 'NEW HIGH SCORE',
    label1Scale: 0.09,
    label2: 'Please type name, then press "Enter"',
    label2Scale: 0.04,
    yMargin: 0.03,
    yPadding1: 0.02,
    yPadding2: 0.04,
    primaryColor: '#FFFFFF',
    secondaryColor: '#FFD700'
}

// init functions
async function init() {
    resizeHandler();

    addEventListener('resize', resizeHandler);
    addEventListener('keydown', (event) => keyDownHandler(event));

    animateGame();
}

function changeState(state) {
    if (validStates.indexOf(state) == -1) {
        console.error('Error changing state: ' + state + ' is an invalid state');
        return;
    }

    // perform actions if state is special state
    switch (state) {
        case 'idle':
            alphabet.completionIndex = 0;
            break;
        case 'game':
            stopwatch.initTime = Date.now();
            break;
    }

    // change state
    currentState = state;
}


// animate functions
function animateGame() {
    requestAnimationFrame(animateGame);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.textAlign = 'left';
    c.textBaseline = 'top';
    // draw stopwatch
    c.fillStyle = stopwatch.primaryColor;
    c.font = `${canvas.height * stopwatch.fontScale}px ${font}`;
    if (currentState === 'game') stopwatch.elapsedTime = Math.min(Date.now() - stopwatch.initTime, 3599999);
    
    if (currentState === 'idle') {
        c.fillText(
            '00:00.000',
            (canvas.width - stopwatch.textWidth) / 2, 
            (canvas.height - canvas.height * stopwatch.fontScale) / 5
        )

        c.strokeStyle = leaderboard.primaryColor;
        c.font = `${canvas.height * leaderboard.fontScale}px ${font}`;
        c.textAlign = 'center';
        c.fillText(
            "Type the alphabet as fast as you can. Press any key to start...",
            canvas.width / 2,
            (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
        )
    } else {
        c.fillText(
            formatTime(stopwatch.elapsedTime),
            (canvas.width - stopwatch.textWidth) / 2, 
            (canvas.height - canvas.height * stopwatch.fontScale) / 5
        )
    }

    c.textAlign = 'center';
    c.font = `${canvas.height * leaderboard.fontScale}px ${font}`;
    c.fillText(
        'WR is 00:03.250',
        canvas.width / 2,
        (canvas.height - canvas.height * stopwatch.fontScale) / 5 + canvas.height * stopwatch.fontScale
    )

    // draw completed alphabet
    c.textAlign = 'left';
    c.fillStyle = alphabet.secondaryColor;
    c.font = `${canvas.height * alphabet.fontScale}px ${font}`;
    c.fillText(
        alphabet.string.substring(0, alphabet.completionIndex), 
        (canvas.width - alphabet.textWidth) / 2, 
        (canvas.height - canvas.height * alphabet.fontScale) / 2
    )

    // draw rest of alphabet
    c.fillStyle = alphabet.primaryColor;
    c.fillText(
        alphabet.string.substring(alphabet.completionIndex),
        (canvas.width - alphabet.textWidth) / 2 + c.measureText(alphabet.string.substring(0, alphabet.completionIndex)).width,
        (canvas.height - canvas.height * alphabet.fontScale) / 2
    )

    // draw leaderboard
    if (currentState == 'results') {
        c.strokeStyle = leaderboard.primaryColor;
        c.font = `${canvas.height * leaderboard.fontScale}px ${font}`;
        c.textAlign = 'center';

        if (stopwatch.elapsedTime < wr) {
            c.fillText(
                "NEW WORLD RECORD!!!",
                canvas.width / 2,
                (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
            );
        } else if (stopwatch.elapsedTime > wr) {
            c.fillText(
                `${stopwatch.elapsedTime - wr} ms short of the world record`,
                canvas.width / 2,
                (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
            );
        } else {
            c.fillText(
                'Tied with world record',
                canvas.width / 2,
                (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
            );
        }



    }
}

// event handler functions
function resizeHandler() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    c.font = `${canvas.height * alphabet.fontScale}px ${font}`;
    alphabet.textWidth = c.measureText(alphabet.string).width;

    c.font = `${canvas.height * stopwatch.fontScale}px ${font}`;
    stopwatch.textWidth = c.measureText('00:00.000').width;

    c.font = `${canvas.height * leaderboard.fontScale}px ${font}`;
    leaderboard.textWidth = c.measureText('00:00.000').width;
}

function keyDownHandler(event) {
    switch (currentState) {
        case 'idle':
            if (event.key.toUpperCase() === 'A')
                alphabet.completionIndex = 1;

            changeState('game');
            break;

        case 'game':

             if (event.key.toUpperCase() === alphabet.string.charAt(alphabet.completionIndex))
                alphabet.completionIndex++;

             if (alphabet.completionIndex > alphabet.string.length - 1)
                endGame()
            break;
        
        case 'results':
            changeState('idle');
            break;
    }
}

// other functions
async function endGame() {
    changeState('results');
}


function formatTime(time) {
    let output = "";
    if (Math.floor(time / 60000) < 10) output += "0";
    output += Math.floor(time / 60000) + ":";

    time %= 60000;
    if (Math.floor(time / 1000) < 10) output += "0";
    output += Math.floor(time / 1000) + ".";

    time %= 1000;
    if (time < 100) output += "0";
    if (time < 10) output += "0";
    output += time;
    
    return output;
}

