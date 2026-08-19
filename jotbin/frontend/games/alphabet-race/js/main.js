
// classes
class Score {
    /**
     * 
     * @param {String} name  name of player
     * @param {Number} time  time achieved by player (stored in milliseconds as an integer)
     */
    constructor(name, time) {
        this.name = name;
        this.time = time;
    }
}

// consts
const api = location.protocol + "//jotbin.net/api/alphabet-race";

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const font = 'arial';

const validStates = ['idle', 'game', 'leaderboard', 'newHighScore', 'fetchingData', 'postError']

// lets
let currentState = "idle"

// objects
const alphabet = {
    string: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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

    if (currentState === 'fetchingData') {
        c.font = `${canvas.height * alphabet.fontScale}px ${font}`;
        c.textAlign = 'center';
        c.textBaseline = 'center';
        c.fillStyle = alphabet.primaryColor;
        c.fillText('Fetching data...', canvas.width / 2, canvas.height / 2);
        return;
    }

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
    if (currentState == 'leaderboard') {
        c.strokeStyle = leaderboard.primaryColor;
        c.font = `${canvas.height * leaderboard.fontScale}px ${font}`;

        if (leaderboard.data) {
            
            for (let i = 0; i < leaderboard.data.length; i++) {
                c.fillText(
                    leaderboard.data[i].name,
                    Math.max((canvas.width - stopwatch.textWidth) / 2, 0),
                    (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * (leaderboard.yMargin + i * leaderboard.fontScale + (i + 1) * leaderboard.yPadding)
                )
                c.fillText(
                    formatTime(leaderboard.data[i].time),
                    Math.max((canvas.width + stopwatch.textWidth) / 2, stopwatch.textWidth) - leaderboard.textWidth,
                    (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * (leaderboard.yMargin + i * leaderboard.fontScale + (i + 1) * leaderboard.yPadding)
                )
            }
        } else {
            c.textAlign = 'center';
            c.fillText(
                "Unable to fetch leaderboard data. Press any key to continue...",
                canvas.width / 2,
                (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
            )
        }
    }

    if (currentState == 'postError') {
        c.textAlign = 'center';
        c.fillText(
            "Unable to post to leaderboard. Press any key to continue...",
            canvas.width / 2,
            (canvas.height + canvas.height * alphabet.fontScale) / 2 + canvas.height * leaderboard.yMargin
        );
    }

    c.textAlign = 'center'
    // draw new high score UI
    if (currentState == 'newHighScore') {
        c.strokeStyle = highScoreUI.primaryColor;
        c.font = `${canvas.height * highScoreUI.label1Scale}px ${font}`;
        c.fillText(
            highScoreUI.label1,
            canvas.width / 2,
            (canvas.height + canvas.height * alphabet.fontScale) / 2 + highScoreUI.yMargin * canvas.height
        )

        c.font = `${canvas.height * highScoreUI.label2Scale}px ${font}`;
        c.fillText(
            highScoreUI.label2,
            canvas.width / 2,
            (canvas.height + canvas.height * alphabet.fontScale) / 2 + (highScoreUI.yMargin + highScoreUI.label1Scale + highScoreUI.yPadding1)* canvas.height
        )

        c.font = `${canvas.height * highScoreUI.nameScale}px ${font}`;
        c.fillStyle = highScoreUI.secondaryColor;
        c.fillText(
            highScoreUI.name,
            canvas.width / 2,
            (canvas.height + canvas.height * alphabet.fontScale) / 2 + (highScoreUI.yMargin + highScoreUI.label1Scale + highScoreUI.label2Scale + highScoreUI.yPadding1 + highScoreUI.yPadding2)* canvas.height
        )
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
        
        case 'leaderboard':
            changeState('idle');
            break;
        
        case 'newHighScore':
            if (event.key === 'Backspace' && highScoreUI.name.length > 0) {
                highScoreUI.name = highScoreUI.name.substring(0, highScoreUI.name.length - 1);
            } else if (event.key === 'Enter') {
                processHighScore(highScoreUI.name, stopwatch.elapsedTime);
            } else if (event.key.length == 1 && highScoreUI.name.length < highScoreUI.maxNameLength) {
                highScoreUI.name += event.key;
            }
            break;

        case 'postError':
            changeState('leaderboard');
            break;
    }
}

// other functions
async function endGame() {
    changeState('fetchingData');
    leaderboard.data = await getLeaderboard();

    if (
        leaderboard.data && 
        (leaderboard.data.length < 10 || 
        stopwatch.elapsedTime < leaderboard.data[leaderboard.data.length - 1].time)
    ) {
        changeState('newHighScore');
    } else {
        changeState('leaderboard');
    }
}

async function processHighScore(name, time) {
    let score = new Score(name, time);

    changeState('fetchingData');
    let success = await postToLeaderboard(score);
    if (!success) {
        changeState('postError');
        return
    }

    leaderboard.data.push(score);
    leaderboard.data = sortByTime(leaderboard.data);
    if (leaderboard.data.length > 10)
        leaderboard.data.pop();

    changeState('leaderboard');
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

function sortByTime(list) {
    if (list.length < 2) return list;

    for (let i = 1; i < list.length; i++) {
        let j = i;
        while(j > 0 && list[j].time < list[j - 1].time) {
            let temp = list[j];
            list[j] = list[j - 1];
            list[j - 1] = temp;
            j--;
        }
    }
    
    return list;
}
/**
 * 
 * Fetches data from leaderboard api
 * 
 * @returns {?Score[]} list of scores in the leaderboard in the order provided by the api
 */
async function getLeaderboard() {
    try {
        const res = await fetch(`${api}/leaderboard`);
        const data = await res.json();

        if (!res.ok) {
            console.error(res.status, data.detail);
            return;
        }
        return data;


    } catch(error) {
        console.error(error)
        return;
    }
}

/**
 * 
 * Posts new high score to leaderboard
 * 
 * @param {Score} score high score to post
 * 
 * @returns {Boolean} true if post succeeded; false otherwise
 */
async function postToLeaderboard(score) {
    try {
        const res = await fetch(`${api}/leaderboard`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(score)
        });

        const data = res.json();

        if (!res.ok) {
            console.error(res.status, data.detail);
            return false;
        }
        
        return true;

    } catch(error) {
        console.error(error)
        return false;
    }
}