const BOARD_SIZE = 9;
const START_BALLS_AMOUNT = 3;
const COLORS = ['#b7724a','#b7724a','#27cfac','#4031fc','#dc87f8','#a45b67','#bdd654']
let boardTab = [];
let idsTab = [];
let table = document.getElementById('table')
let clicked = 0;
let anyGood;

function clickHandler() {
  let id = this.id;
  let a = !clicked ? 'S' : 'M';
  this.innerHTML = a;
  this.className = a;
  boardTab[id.charAt(0)][id.charAt(2)] = a;
  clicked++;
  if (clicked > 1) {
    document.querySelectorAll('td').forEach((el) => el.removeEventListener('click', clickHandler))
    firstStep('S');
  }
}

function updateTable() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (boardTab[i][j] == 'X') {
        let td = document.getElementById(i + '_' + j)
        let ball = document.createElement('div');
        ball.className = "ball";
        let colorIndex = Math.floor(Math.random()*7)
        ball.style.backgroundColor = COLORS[colorIndex];
        td.appendChild(ball);
      }
    }
  }
}

function drawBalls() {
  let drawn = [];
  for (let i = 0; i < START_BALLS_AMOUNT; i++) {
    let y = Math.floor(Math.random() * BOARD_SIZE);
    let x = Math.floor(Math.random() * BOARD_SIZE);
    if (drawn.indexOf([y, x]) === -1) {
      drawn.push([y, x]);
      boardTab[y][x] = 'X'
    } else i--;
  }
}

function checkRoad(y, x, start) {
  let preTab = idsTab[y][x].slice();
  preTab.push(y + '_' + x);
  if (x - 1 >= 0) {
    if (boardTab[y][x - 1] == 0 || boardTab[y][x - 1] == 'M') {
      boardTab[y][x - 1] = start + 1;
      anyGood = true;
      idsTab[y][x - 1] = preTab;
    }
  }
  if (x + 1 < BOARD_SIZE) {
    if (boardTab[y][x + 1] == 0 || boardTab[y][x + 1] == 'M') {
      boardTab[y][x + 1] = start + 1;
      anyGood = true;
      idsTab[y][x + 1] = preTab;
    }
  }
  if (y - 1 >= 0) {
    if (boardTab[y - 1][x] == 0 || boardTab[y - 1][x] == 'M') {
      boardTab[y - 1][x] = start + 1;
      anyGood = true;
      idsTab[y - 1][x] = preTab;
    }
  }
  if (y + 1 < BOARD_SIZE) {
    if (boardTab[y + 1][x] == 0 || boardTab[y + 1][x] == 'M') {
      boardTab[y + 1][x] = start + 1;
      anyGood = true;
      idsTab[y + 1][x] = preTab;
    }
  }
}

function firstStep(start) {
  if (start == 'S') {
    let s = document.querySelector('.S');
    let y = parseInt(s.id.charAt(0))
    let x = parseInt(s.id.charAt(2))
    checkRoad(y, x, 0);
    nextStep(1);
  }
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
  } else {
    let m = document.querySelector('.M');
    let y = parseInt(m.id.charAt(0));
    let x = parseInt(m.id.charAt(2));
    boardTab[y][x] = 'M'
    updateTable();
    colorRoad(y, x);
  }

}

function colorRoad(y, x) {
  let road = idsTab[y][x];
  if (road.length > 0) {
    for (let i = 0; i < road.length; i++) {
      document.getElementById(road[i]).style.backgroundColor = 'pink';
    }
    let sAndM = document.querySelectorAll('.S, .M')
    sAndM.forEach((el) => {
      el.style.backgroundColor = 'pink';
    })
  } else {
    document.getElementById('err').innerHTML = "Droga nie istnieje"
  }

}

function createTable() {
  let table = document.createElement('table');
  table.id = 'table';
  for (let i = 0; i < BOARD_SIZE; i++) {
    let boardRow = [];
    let idsRow = []
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
      td.addEventListener('click', clickHandler)
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  document.body.appendChild(table);
  drawBalls()
  updateTable();
}

function init() {
  createTable();
}

document.addEventListener('DOMContentLoaded', init);
