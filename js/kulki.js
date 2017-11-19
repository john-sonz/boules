const BOARD_SIZE = 9;
const START_BALLS_AMOUNT = 3;
const COLORS = ['#b7724a', '#b7724a', '#27cfac', '#4031fc', '#dc87f8', '#a45b67', '#bdd654'];
let boardTab = [];
//let idsTab = [];
let table = document.getElementById('table');
let clicked = false;
let anyGood;
let balls = [];

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
        //let idsRow = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            boardRow.push(0);
            //idsRow.push([]);
        }
        boardTab.push(boardRow);
        //idsTab.push(idsRow);
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

function createTable2() {
    let table = document.createElement('table');
    for (let i = 0; i < BOARD_SIZE; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < BOARD_SIZE; j++) {
            let td = document.createElement('td');
            td.id = 'h' + '_' + i + '_' + j;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

function updateTable2() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let td = document.getElementById('h' + '_' + i + '_' + j);
            td.innerHTML = boardTab[i][j];
            let td2 = document.getElementById('a' + '_' + i + '_' + j);
            //td2.innerHTML = idsTab[i][j];
        }
    }
}

function ballClickHandler() {
    if (this.className.includes('clicked')) {
        this.classList.remove('clicked');
        clicked = false;
    } else {
        if (clicked) {
            document.querySelector('.clicked').classList.remove('clicked');
        } else {
            clicked = true;

        }
        this.classList.add('clicked');
    }
    updateTable2();
    console.log(clicked);

}

function resetTabs() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            //idsTab[i][j] = [];
            if (boardTab[i][j] != 'X') boardTab[i][j] = 0;
        }
    }
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
            balls.push(ball);
            boardTab[y][x] = 'X';
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
        let id = this.id.split('_');
        let tdY = parseInt(id[0]);
        let tdX = parseInt(id[1]);
        let chosenBall = document.querySelector('.clicked');
        let chosenBallId = chosenBall.id.split('_');
        chosenBallId.shift();
        startY = parseInt(chosenBallId[0]);
        startX = parseInt(chosenBallId[1]);
        firstStep(startY, startX);
        //console.log(idsTab[tdY][tdY]);
        if (boardTab[tdY][tdY] != 0) {
            clicked = false;
            chosenBall.id = 'b' + '_' + tdY + '_' + tdX;
            chosenBall.classList.remove('clicked');
            let clonedBall = chosenBall.cloneNode();
            clonedBall.addEventListener('click', ballClickHandler);
            this.appendChild(clonedBall);
            chosenBall.parentElement.addEventListener('click', moveBall);
            chosenBall.parentElement.classList.add('free');
            chosenBall.parentNode.removeChild(chosenBall);
            boardTab[tdY][tdX] = 'X';
            boardTab[startY][startX] = 0;
            this.removeEventListener('click', moveBall);
            this.classList.remove('free');
            let ball = balls.find((el) => {
                if (el.x == startX && el.y == startY) return true;
                else return false;
            });
            ball.y = tdY;
            ball.x = tdX;
        }
        resetTabs();
        console.log(clicked);
    }
}

function checkRoad(y, x, start) {
    /*let preTab = idsTab[y][x].slice();
    preTab.push(y + '_' + x);*/
    if (x - 1 >= 0) {
        if (boardTab[y][x - 1] == 0) {
            boardTab[y][x - 1] = start + 1;
            anyGood = true;
            //idsTab[y][x - 1] = preTab;
        }
    }
    if (x + 1 < BOARD_SIZE) {
        if (boardTab[y][x + 1] == 0) {
            boardTab[y][x + 1] = start + 1;
            anyGood = true;
            //idsTab[y][x + 1] = preTab;
        }
    }
    if (y - 1 >= 0) {
        if (boardTab[y - 1][x] == 0) {
            boardTab[y - 1][x] = start + 1;
            anyGood = true;
            //idsTab[y - 1][x] = preTab;
        }
    }
    if (y + 1 < BOARD_SIZE) {
        if (boardTab[y + 1][x] == 0) {
            boardTab[y + 1][x] = start + 1;
            anyGood = true;
            //idsTab[y + 1][x] = preTab;
        }
    }

}

function firstStep(y, x) {
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
    updateTable2();
}

function init() {
    createTable();
    createTable2();
    updateTable2();
}

document.addEventListener('DOMContentLoaded', init);