const BOARD_SIZE = 9;
const START_BALLS_AMOUNT = 3;
const COLORS = ['#e4c726', '#eba78e', '#27cfac', '#4031fc', '#dc87f8', '#a45b67', '#bf0571'];
const DESTROY_AMOUNT = 5;
let boardTab = [];
let idsTab = [];
let table = document.getElementById('table');
let clicked = false;
let anyGood;
let balls = [];
let toDelete = [];
let anyDeleted = false;
let nextColors = [];
while (nextColors.length < START_BALLS_AMOUNT) {
  nextColors.push(Math.floor(Math.random() * COLORS.length));
}
class Ball {
  constructor(color, posY, posX) {
    this.color = color;
    this.y = posY;
    this.x = posX;
    this.toDelete = false;
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

function ballClickHandler() {
  let tds = document.getElementsByTagName('td');
  let id = this.parentNode.id.split('_');
  let tdY = parseInt(id[0]);
  let tdX = parseInt(id[1]);
  resetTabs();
  checkRoad(tdY, tdX, 0);
  if (!anyGood) return;
  firstStep(tdY, tdX);
  clearRoad();
  if (this.className.includes('clicked')) {
    this.classList.remove('clicked');
    clicked = false;
    for (let i = 0; i < 81; i++) {
      tds[i].removeEventListener('mouseover', previewRoad);
    }
  } else {
    if (clicked) {
      document.querySelector('.clicked').classList.remove('clicked');
    } else {
      clicked = true;
      this.parentNode.addEventListener('mouseover', clearRoad);
      for (let i = 0; i < 81; i++) {
        let tdId = {
          y: parseInt(tds[i].id.split('_')[0]),
          x: parseInt(tds[i].id.split('_')[1])
        };
        if (boardTab[tdId.y][tdId.x] != 0) {
          tds[i].addEventListener('mouseover', previewRoad);
        } else tds[i].addEventListener('mouseover', clearRoad);
      }
    }
    this.classList.add('clicked');
  }
}

function resetTabs() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      idsTab[i][j] = [];
      if (boardTab[i][j] != 'X') boardTab[i][j] = 0;
    }
  }
}

function drawBalls() {
  let drawnCoords = [];
  let drawAmount = BOARD_SIZE * BOARD_SIZE - balls.length > START_BALLS_AMOUNT ? START_BALLS_AMOUNT : BOARD_SIZE * BOARD_SIZE - balls.length;
  while (drawnCoords.length < drawAmount) {

    let y = Math.floor(Math.random() * BOARD_SIZE);
    let x = Math.floor(Math.random() * BOARD_SIZE);
    if (boardTab[y][x] != 'X') {
      let colorIndex = nextColors[drawnCoords.length];
      drawnCoords.push([y, x]);
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
  nextColors = [];
  while (nextColors.length < START_BALLS_AMOUNT) {
    nextColors.push(Math.floor(Math.random() * COLORS.length));
  }
  updatePreview();
}

function updatePreview() {
  let previewBalls = document.getElementsByClassName('preview_ball');
  for (let i = 0; i < previewBalls.length; i++) {
    previewBalls[i].style.backgroundColor = COLORS[nextColors[i]];
  }
}

function moveBall() {
  if (clicked) {
    let id = this.id.split('_');
    let tdY = parseInt(id[0]);
    let tdX = parseInt(id[1]);
    let allBalls = document.getElementsByClassName('ball');
    let chosenBall = document.querySelector('.clicked');
    let chosenBallId = chosenBall.id.split('_');
    chosenBallId.shift();
    startY = parseInt(chosenBallId[0]);
    startX = parseInt(chosenBallId[1]);
    firstStep(startY, startX);
    if (boardTab[tdY][tdX] != 0) {
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
      let tds = document.getElementsByTagName('td');
      for (let i = 0; i < tds.length; i++) {
        tds[i].removeEventListener('mouseover', previewRoad);
      }
      for (let i = 0; i < allBalls.length; i++) {
        allBalls[i].removeEventListener('click', ballClickHandler);
      }
      boardTab[startY][startX] = 0;
      this.removeEventListener('click', moveBall);
      this.classList.remove('free');
      let ball = balls.find((el) => {
        if (el.x == startX && el.y == startY) return true;
        else return false;
      });
      ball.y = tdY;
      ball.x = tdX;
      idsTab[tdY][tdX].forEach((el) => {
        document.getElementById(el).style.backgroundColor = 'gray';
      });
      this.style.backgroundColor = 'gray';
      setTimeout(x => {
        clearRoad();
        checkBalls();
        for (let i = 0; i < allBalls.length; i++) {
          allBalls[i].addEventListener('click', ballClickHandler);
        }
        if (!anyDeleted) {
          drawBalls();
          console.log(balls.length, 'draw');
          toDelete = [];
          if (balls.length >= BOARD_SIZE * BOARD_SIZE) {
            for (let i = 0; i < allBalls.length; i++) {
              allBalls[i].removeEventListener('click', ballClickHandler);
            }
            let endInfo = document.createElement('div');
            endInfo.id = 'end-div';
            let score = document.getElementById('score').innerText;
            let endText = document.createTextNode('Koniec gry! Twoj wynik to: ' + score + ' punktów');
            endInfo.appendChild(endText);
            console.log(endInfo);
            document.body.insertBefore(endInfo, document.getElementById('score-div'));
          }
        }
        anyDeleted = false;
      }, 500);
    }
  }
}

function checkRoad(y, x, start) {
  let preTab = idsTab[y][x].slice();
  preTab.push(y + '_' + x);
  if (x - 1 >= 0) {
    if (boardTab[y][x - 1] == 0) {
      boardTab[y][x - 1] = start + 1;
      anyGood = true;
      idsTab[y][x - 1] = preTab;
    }
  }
  if (x + 1 < BOARD_SIZE) {
    if (boardTab[y][x + 1] == 0) {
      boardTab[y][x + 1] = start + 1;
      anyGood = true;
      idsTab[y][x + 1] = preTab;
    }
  }
  if (y - 1 >= 0) {
    if (boardTab[y - 1][x] == 0) {
      boardTab[y - 1][x] = start + 1;
      anyGood = true;
      idsTab[y - 1][x] = preTab;
    }
  }
  if (y + 1 < BOARD_SIZE) {
    if (boardTab[y + 1][x] == 0) {
      boardTab[y + 1][x] = start + 1;
      anyGood = true;
      idsTab[y + 1][x] = preTab;
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
}

function clearRoad() {
  let tds = document.getElementsByTagName('td');
  for (let i = 0; i < tds.length; i++) {
    tds[i].style.backgroundColor = 'white';
  }
}

function previewRoad() {
  clearRoad();
  let id = this.id.split('_');
  let tdY = parseInt(id[0]);
  let tdX = parseInt(id[1]);
  if (boardTab[tdY][tdX] !== 0 && boardTab[tdY][tdX] != 'X') {
    this.style.backgroundColor = 'pink';
    idsTab[tdY][tdX].forEach((el) => {
      document.getElementById(el).style.backgroundColor = 'pink';
    });
  } else clearRoad();
}

function checkBalls() {

  COLORS.forEach(color => {
    let colorBalls = balls.filter(ball => {
      return ball.color == color;
    });
    let board, boardRow;
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      boardRow = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        boardRow.push(false);
      }
      board.push(boardRow);
    }
    for (let i = 0; i < colorBalls.length; i++) {
      board[colorBalls[i].y][colorBalls[i].x] = true;
    }
    for (let i = 0; i < colorBalls.length; i++) {
      checkSurroundings(board, colorBalls[i].y, colorBalls[i].x, colorBalls);
    }
  });
  deleteBalls();
}

function checkSurroundings(tab, yPos, xPos, cb) {
  toDelete = [];
  for (let y = (yPos > 0 ? -1 : 0); y < (yPos + 1 < BOARD_SIZE ? 2 : 1); y++) {
    for (let x = (xPos > 0 ? -1 : 0); x < (xPos + 1 < BOARD_SIZE ? 2 : 1); x++) {
      if (x != 0 || y != 0) {
        if (tab[yPos + y][xPos + x]) {
          toDelete.push({
            y: yPos + y,
            x: xPos + x
          });
          toDelete.push({
            y: yPos,
            x: xPos
          });
          checkInDirection(tab, yPos + y, xPos + x, {
            y: y,
            x: x
          }, 1, cb);
        }
      }
    }
  }
}

function checkInDirection(tab, y, x, direction, counter, cb) {
  let yGood = y + direction.y >= 0 && y + direction.y < BOARD_SIZE;
  let xGood = x + direction.x >= 0 && x + direction.x < BOARD_SIZE;
  if (yGood && xGood) {
    if (tab[y + direction.y][x + direction.x]) {
      toDelete.push({
        y: y + direction.y,
        x: x + direction.x
      });
      checkInDirection(tab, y + direction.y, x + direction.x, direction, counter + 1, cb);
    } else {
      if (counter + 1 >= DESTROY_AMOUNT) {
        toDelete.forEach(pos => {
          let b = cb.find(ball => {
            return (ball.y == pos.y && ball.x == pos.x);
          });
          b.toDelete = true;
        });
      }
      toDelete = [];
    }
  } else {
    if (counter + 1 >= DESTROY_AMOUNT) {
      toDelete.forEach(pos => {
        let b = cb.find(ball => {
          return (ball.y == pos.y && ball.x == pos.x);
        });
        b.toDelete = true;
      });
    }
    toDelete = [];
  }
}

function deleteBalls() {
  let points = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].toDelete) {
      let id = balls[i].y + '_' + balls[i].x;
      let td = document.getElementById(id);
      td.innerHTML = '';
      td.classList.add('free');
      td.addEventListener('click', moveBall);
      boardTab[balls[i].y][balls[i].x] = 0;
      balls.splice(i, 1);
      points++;
      i--;
    }
  }
  if (points != 0) anyDeleted = true;
  let score = document.getElementById('score');
  score.innerHTML = parseInt(score.innerHTML) + points;
}

function init() {
  let preview = document.createElement('div');
  preview.id = 'preview';
  for (let i = 0; i < 3; i++) {
    let previewBall = document.createElement('div');
    previewBall.classList.add('preview_ball');
    preview.appendChild(previewBall);
  }
  let score = document.createElement('div');
  score.id = 'score-div';
  score.innerHTML = 'Score: <span id="score">0</span>';
  document.body.appendChild(score);
  document.body.appendChild(preview);
  createTable();
}
document.addEventListener('DOMContentLoaded', init);