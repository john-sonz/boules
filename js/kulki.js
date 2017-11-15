const BOARD_SIZE = 9;
const START_BALLS_AMOUNT = 3;
const COLORS = ['#b7724a', '#b7724a', '#27cfac', '#4031fc', '#dc87f8', '#a45b67', '#bdd654'];
let boardTab = [];
let idsTab = [];
let table = document.getElementById('table');
let clicked = false;
let anyGood;

class Ball {
    constructor(color, posY, posX) {
        this.color = color;
        this.y = posY;
        this.x = posX;
    }
}

function createTable() {
    let table = document.createElement('table');
    table.id = 'table';
    for (let i = 0; i < BOARD_SIZE; i++) {
        let boardRow = [];
        let idsRow = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            boardRow.push(0);
            idsRow.push([]);
        }
        boardTab.push(boardRow);
        idsTab.push(idsRow);
        let tr = document.createElement('tr');
        for (let j = 0; j < BOARD_SIZE; j++) {
            let td = document.createElement('td');
            td.id = i + '_' + j;
            td.classList.add('free');
            td.addEventListener('click', moveBall);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
    drawBalls();

}

function ballClickHandler(e) {
    if (clicked) {
        document.querySelector('.clicked').classList.remove('clicked');
    } else {
        clicked = true;
    }
    this.classList.add('clicked');    

}

function drawBalls() {
    let drawnYs = [];
    let drawnXs = [];
    let drawnCoords = [];
    while (drawnCoords.length < START_BALLS_AMOUNT) {
        let y = Math.floor(Math.random() * BOARD_SIZE);
        let x = Math.floor(Math.random() * BOARD_SIZE);
        if (drawnYs.indexOf(y) === -1 || drawnXs.indexOf(x) === -1) {
            drawnCoords.push([y, x]);
            drawnXs.push(x);
            drawnYs.push(y);
            let colorIndex = Math.floor(Math.random() * 7);
            let ball = new Ball(COLORS[colorIndex], y, x);
            boardTab[y][x] = ball;
            let td = document.getElementById(y + '_' + x);
            let ballDiv = document.createElement('div');
            ballDiv.id = 'b_' + y + '_' + x;
            ballDiv.className = "ball";
            ballDiv.style.backgroundColor = COLORS[colorIndex];
            ballDiv.addEventListener('click', ballClickHandler);
            td.appendChild(ballDiv);
            td.classList.remove('free');
            td.removeEventListener('click', moveBall);
        }
    }
}

function moveBall() {
    if (clicked) {
        let chosenBall = document.querySelector('.clicked');
        let chosenBallId = chosenBall.id.split('_');
        chosenBallId.shift();        
        let startPos = {
            y: parseInt(chosenBallId[0]),
            x: parseInt(chosenBallId[1])
        };
        console.log(startPos);
        firstStep(startPos.y, startPos.x);
        let id = this.id.split('_');
        if (idsTab[id[0]][id[1]].length > 0) {
            chosenBall.classList.remove('clicked');
            let clonedBall = chosenBall.cloneNode();
            clonedBall.addEventListener('click', ballClickHandler);
            this.appendChild(clonedBall);
            chosenBall.parentElement.addEventListener('click', moveBall);
            chosenBall.parentElement.classList.add('free');
            chosenBall.parentNode.removeChild(chosenBall);
            boardTab[id[0]][id[1]] = boardTab[startPos.y][startPos.x];
            boardTab[startPos.y][startPos.x] = 0;
            this.removeEventListener('click', moveBall);
            this.classList.remove('free');
            clicked = false;

        }
    }
}

function checkRoad(y, x, start) {
    let preTab = idsTab[y][x].slice();
    preTab.push(y + '_' + x);
    if (x - 1 >= 0) {
        if (boardTab[y][x - 1] == 0 || boardTab[y][x - 1] == 'M') {
            boardTab[y][x - 1] = start + 1;
            if (boardTab[y][x - 1] == 'M') {
                anyGood = false;
                return;
            }
            anyGood = true;
            idsTab[y][x - 1] = preTab;
        }
    }
    if (x + 1 < BOARD_SIZE) {
        if (boardTab[y][x + 1] == 0 || boardTab[y][x + 1] == 'M') {
            boardTab[y][x + 1] = start + 1;
            if (boardTab[y][x - 1] == 'M') {
                anyGood = false;
                return;
            }
            anyGood = true;
            idsTab[y][x + 1] = preTab;
        }
    }
    if (y - 1 >= 0) {
        if (boardTab[y - 1][x] == 0 || boardTab[y - 1][x] == 'M') {
            boardTab[y - 1][x] = start + 1;
            if (boardTab[y - 1][x] == 'M') {
                anyGood = false;
                return;
            }
            anyGood = true;
            idsTab[y - 1][x] = preTab;
        }
    }
    if (y + 1 < BOARD_SIZE) {
        if (boardTab[y + 1][x] == 0 || boardTab[y + 1][x] == 'M') {
            boardTab[y + 1][x] = start + 1;
            if (boardTab[y + 1][x] == 'M') {
                anyGood = false;
                return;
            }
            anyGood = true;
            idsTab[y + 1][x] = preTab;
        }
    }
}

function firstStep(y, x) {
    console.log(y);
    console.log(x);
    checkRoad(y, x, 0);
    nextStep(1);
}

function nextStep(start) {
    anyGood = false;
    for (let i = 0; i < boardTab.length; i++) {
        for (let j = 0; j < boardTab[i].length; j++) {
            if (boardTab[i][j] == start) {
                checkRoad(i, j, start);
            }
        }
    }
    if (anyGood) {
        nextStep(start + 1);
    }
}

function init() {
    createTable();
}

document.addEventListener('DOMContentLoaded', init);