"use strict";

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

  const _isBoardFull = function () {
    return board.every(item => item !== undefined)
  }

  const turn = (function () {
    let active;
    return function (restart = undefined) {
      if (restart === undefined) {
        (active === 'X') ? active = 'O' : active = 'X';
        return active
      } else if (restart === 'restart') {
          active = undefined;
      }
    }
  })()

  const isOver = function () {
    // Notify whether every square of the board
    // is already taken or if a player won

    let isOver = _isBoardFull() || !!winner();
    if (isOver) Gameplay.isActive = false;
    return (isOver)
  }

  const isDraw = function () {
    return _isBoardFull() && !winner()
  }

  const winner = function () {
    const [p0, p1, p2, p3, p4, p5, p6, p7 ,p8] = board;

    const _check = function (a, b, c) {
      return (a !== undefined) && (a === b) && (b === c)
    }

    if (_check(p0, p1, p2)) return p0
    if (_check(p3, p4, p5)) return p3
    if (_check(p6, p7, p8)) return p6
    if (_check(p0, p3, p6)) return p0
    if (_check(p1, p4, p7)) return p1
    if (_check(p2, p5, p8)) return p2
    if (_check(p0, p4, p8)) return p0
    if (_check(p2, p4, p6)) return p2
  }

  return {turn, isOver, winner, isDraw, isActive}
})(Gameboard.array)

/* ----------------

Computer module

------------------*/

const Computer = (function (board) {
  const _selectRandomItem = function (arr) {
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
  const create = function (name, userMark) {
    let win = 0;
    const m = userMark;
    const uName = name;
    const proto = {
      winner: function () {
        return ++win
      },
      get roundsWon() {
        return win
      },
      get userName() {
        return uName
      },
    }

    const newPlayer = Object.create(proto)
    Object.defineProperty(newPlayer, 'mark', {
      get: function () {return m}
    })

    return newPlayer
  }
return {create}
})()

/* ---------------------

displayController module

----------------------*/

const displayController = (function (options) {
  const gameboard = document.querySelectorAll(options.squareSelector);

  const _updateBoard = function () {
    gameboard.forEach((item) => {
      let index = item.getAttribute('data-index');
      let array = options.array;
      if (array[index] !== undefined) {item.innerText = array[index];}
    })
  }

  const update = function () {
    _updateBoard()
  }

  const winner = function () {
    let w = Gameplay.winner();
    if (w === 'X') ScoreBoard.update({x: 1});
    if (w === 'O') ScoreBoard.update({o: 1});
  }

  const clear = function () {
    gameboard.forEach((item) => {
      item.innerText = '';
    })
    Gameboard.clear();
  }

  return {clear, update, winner}
})(
  {
    squareSelector: '[data-index]',
    array: Gameboard.array,
  }
)

/* ----------------

START main program

------------------*/

const gameContainer = document.querySelector('div.gameboard-container');
const board = document.querySelector('div.board');
const playerSelection = document.querySelector('div.player-controls > select');
const playButton = document.querySelector('div.player-controls > button');

const boardListener = function (e) {
  const target = e.target;
  if (Gameplay.isActive && target.innerText === ''){
    const index = target.getAttribute('data-index');
    Gameboard.array[index] = Gameplay.turn();
  }

  if (Gameplay.isOver()) {
    playButton.innerText = 'Restart';
    Gameplay.turn('restart');
    displayController.winner();
    board.removeEventListener('pointerdown', boardListener)
  };
}

let whoPlay = playerSelection.value;
ScoreBoard.setPlayerLabel(whoPlay);

gameContainer.addEventListener('pointerdown', () => {
  displayController.update();
})

playerSelection.addEventListener('change', () => {
  whoPlay = playerSelection.value;
  ScoreBoard.setPlayerLabel(whoPlay);
})

playButton.addEventListener('pointerdown', () => {
  Gameplay.isActive = true;
  board.addEventListener('pointerdown', boardListener)
  if (playButton.innerText === 'Restart') {
    displayController.clear()
  }
})
