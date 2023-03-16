"use strict";

/* ---------------- Gameboard module ----------------- */

const Gameboard = ( function () {

  const array = Array(9).fill(undefined);

  const clear = function () {
    array.fill(undefined);
  }

  return {array, clear};
})();

/* ---------------- Gameplay module ------------------ */

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

/* ---------------- Computer module ------------------ */

const Computer = (function (board) {
  const _selectRandomItem = function (arr) {
    const length = arr.length;
    const random = Math.floor(Math.random() * length)
    return arr[random]
  }

  return {}
})(Gameboard.array)

/* ----------------- Players module ------------------ */

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

/* ------------- User Interface module --------------- */

const UserInterface = (function () {

  const _getElem = function (element) {
    return document.querySelector(element)
  }

  const gameSelection = {
    card: _getElem('[data-modal="game-selection"]'),
    playerVsPlayerBtn: _getElem('[data-player="player-vs-player"]'),
    playerVsComputerBtn: _getElem('[data-player="player-vs-computer"]'),
  };
  const playerMark = {
    card: _getElem('[data-modal="player-mark"]'),
    xSelectionBtn: _getElem('[data-mark="x"]'),
    oSelectionBtn: _getElem('[data-mark="o"]'),
  };
  const playerName = {
    card: _getElem('[data-modal="player-name"]'),
    playerOne: _getElem('[data-input="player-x-name"]'),
    playerTwo: _getElem('[data-input="player-o-name"]'),
  };
  const startGameBtn = _getElem('[data-button="start"]');

  return {
    gameSelection,
    playerMark,
    playerName,
    startGameBtn,
  }
})()

/* --------------- START main program ---------------- */
