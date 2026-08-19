// Elements
let titleText;
let statusText;
let descriptionText;

// Constants
const statusList = [403, 404, 418, 500];
const titleList = ['Forbidden', 'Page Not Found', "I'm a Teapot", 'Internal Error', 'Unknown Error'];
const descriptionList = [
    'You do not have permission to view this page. Please try another URL or return to the <a href="https://jotbin.net">home page</a>.',
    'The page could not be found. Please double check the URL or return to the <a href="https://jotbin.net">home page</a>.',
    'The server refuses to brew coffee because it is permanently a teapot. Please stop harassing our server.',
    'An internal error occurred. Please refresh the page or return to the <a href="https://jotbin.net">home page</a>.',
    'An unknown error occurred. Please refresh the page or return to the <a href="https://jotbin.net">home page</a>.'
];

// Variables
let urlQuery = '';
let httpStatus;
let statusIndex = -1;

// Functions
function main() {
    // set variables
    titleText = document.querySelector('#title-text');
    statusText = document.querySelector('#status-text');
    descriptionText = document.querySelector('#description-text');

    urlQuery = new URLSearchParams(location.search);
    httpStatus = Number(urlQuery.get('status'));

    // select index
    if (Math.floor(httpStatus / 100) === 5)
        statusIndex = statusList.indexOf(500);

    else if (statusList.indexOf(httpStatus) == -1)
        statusIndex = statusList.length;

    else
        statusIndex = statusList.indexOf(httpStatus);

    // update DOM
    titleText.innerText = titleList[statusIndex];
    statusText.innerText = httpStatus;
    descriptionText.innerHTML = descriptionList[statusIndex];
}