/* ----------------

Gameboard module

------------------*/
const Gameboard = ( function () {

  const array = Array(9).fill(undefined);

  const clear = function () {
    array.fill(undefined);
  }

  return {array, clear};
})();

/* ----------------

Gameplay module

------------------*/

const Gameplay = ( function (board) {

  let isActive = false;

  function isBoardFull () {
    return board.every(item => item !== undefined)
  }

  const turn = (function () {
    let active;
    return function () {
      (active === 'X') ? active = 'O' : active = 'X';
      return active
    }
  })()

  const isOver = function () {
    // Notify whether every square of the board
    // is already taken or if a player won

    let isOver = isBoardFull() || !!winner();
    if (isOver) Gameplay.isActive = false;
    return (isOver)
  }

  const isDraw = function () {
    return isBoardFull() && !winner()
  }

  const winner = function () {
    const [p0, p1, p2, p3, p4, p5, p6, p7 ,p8] = board;

    function check (a, b, c) {
      if (a === 'X' || a === 'O') {
        return (a === b) && (b === c)
      }
    }

    if (check(p0, p1, p2)) return p0
    if (check(p3, p4, p5)) return p3
    if (check(p6, p7, p8)) return p6
    if (check(p0, p3, p6)) return p0
    if (check(p1, p4, p7)) return p1
    if (check(p2, p5, p8)) return p2
    if (check(p0, p4, p8)) return p0
    if (check(p2, p4, p6)) return p2
  }

  return {turn, isOver, winner, isDraw, isActive}
})(Gameboard.array)

const ScoreBoard = (function(selector) {
  const board = document.querySelector(selector);
  const playerX = board.querySelector('[data-player="X"]');
  const playerO = board.querySelector('[data-player="O"]');
  const scoreX = board.querySelector('[data-score="X"]');
  const scoreO = board.querySelector('[data-score="O"]');
  
  const setPlayerLabel = function (str) {
    if (str === 'human-computer') {
      playerX.innerText = 'Player';
      playerO.innerText = 'Computer';
    }
    if (str === 'human-human') {
      playerX.innerText = 'Player X';
      playerO.innerText = 'Player O';
    }
  }

  const update = function (x, o) {
    scoreX.innerText = x;
    scoreO.innerText = o;
  }

  return {setPlayerLabel, update}  
})('div.score-board')

/* ----------------

Computer module

------------------*/

const Computer = (function (board) {
  function selectRandomItem (arr) {
    const length = arr.length;
    const random = Math.floor(Math.random() * length)
    return arr[random]
  }

  return {}
})(Gameboard.array)

/* ----------------

Players module

------------------*/

const Players = (function() {
  function create (playerMark) {
    let win = 0;
    let m = playerMark;
    const winner = function () {
      return ++win
    }
    const roundsWon = function () {
      return win
    }
    return {
      winner,
      roundsWon,
      get mark () {return m},
      set mark (mark) {m = mark},
    }
  }
return {create}
})()

/* ----------------

START main program

------------------*/

let whoPlay;

const gameContainer = document.querySelector('div.gameboard-container');
const board = document.querySelector('div.board');
const playerSelection = document.querySelector('div.player-controls > select');
const playButton = document.querySelector('div.player-controls > button');

gameContainer.addEventListener('pointerdown', () => {

})

playButton.addEventListener('pointerdown', () => {
  Gameboard.clear()
  Gameplay.isActive = true;
  whoPlay = playerSelection.value;
  ScoreBoard.setPlayerLabel(whoPlay);
})

board.addEventListener('pointerdown', (e) => {

  const target = e.target;
  if (Gameplay.isActive && target.innerText === ''){
    const index = target.getAttribute('data-index');
    Gameboard.array[index] = Gameplay.turn();
  }

  if (Gameplay.isOver()) playButton.innerText = 'Restart';

})
