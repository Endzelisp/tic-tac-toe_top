/* ----------------

Gameboard module

------------------*/
const Gameboard = ( function () {

  const square = function () {
    const div = document.createElement('div');
    let squareMark;
    return {
      get mark () {
        return squareMark;
      },
      set mark (mark) {
        squareMark = mark;
      },
      div,
    }
  }

  const render = function (selector) {
    const fatherElem = document.querySelector(selector);
    array.map(item => {
      fatherElem.appendChild(item.div);
    })
  }

  const clear = function () {
    array.map((item) => {
      item.div.innerText = '';
      item.mark = undefined;
    })
  }

  const update = function () {
    array.map(item => {
      if (item.mark) item.div.innerText = item.mark
    })
  }

  const array = Array(9).fill(null).map(square);
  array.map((item, index) => item.div.setAttribute('data-index', index));

  return {array, render, clear, update};
})();

/* ----------------

Gameplay module

------------------*/

const Gameplay = ( function (board) {

  let isActive = false;

  function isBoardFull () {
    return board.every(item => item.mark !== undefined)
  }

  const activePlayer = (function () {
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

    if (check(p0.mark, p1.mark, p2.mark)) return p0.mark
    if (check(p3.mark, p4.mark, p5.mark)) return p3.mark
    if (check(p6.mark, p7.mark, p8.mark)) return p6.mark
    if (check(p0.mark, p3.mark, p6.mark)) return p0.mark
    if (check(p1.mark, p4.mark, p7.mark)) return p1.mark
    if (check(p2.mark, p5.mark, p8.mark)) return p2.mark
    if (check(p0.mark, p4.mark, p8.mark)) return p0.mark
    if (check(p2.mark, p4.mark, p6.mark)) return p2.mark
  }

  return {activePlayer, isOver, winner, isDraw, isActive}
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

  const move = function () {
    const freeSquares = board.filter(item => item.mark === undefined);
    const randomSelectedSquare = selectRandomItem(freeSquares);
    const mark = Gameplay.activePlayer();
    randomSelectedSquare.mark = randomSelectedSquare.div.innerText = mark;
  }
  return {move}
})(Gameboard.array)

/* ----------------

Players module

------------------*/

const Players = (function() {
  function newPlayer (playerMark) {
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

  const create = function () {
    const players = [];
    players[0] = newPlayer('X');
    players[1] = newPlayer('O');
    return players
  }

return {create}
})()

/* ----------------

START main program

------------------*/

Gameboard.render('div.board');
const players = Players.create();
let whoPlay;

const gameContainer = document.querySelector('div.gameboard-container');
const board = document.querySelector('div.board');
const playerSelection = document.querySelector('div.player-controls > select');
const playButton = document.querySelector('div.player-controls > button');

gameContainer.addEventListener('pointerdown', () => {
  Gameboard.update()
})

playButton.addEventListener('pointerdown', () => {
  Gameboard.clear()
  Gameplay.isActive = true;
  whoPlay = playerSelection.value;
  ScoreBoard.setPlayerLabel(whoPlay);
})

board.addEventListener('pointerdown', (e) => {
  if (Gameplay.isActive) {
    const target = e.target;
    if (!Gameplay.isOver() && target.innerText === ''){
      const index = target.getAttribute('data-index');
      Gameboard.array[index].mark = Gameplay.activePlayer();
      const winner = Gameplay.winner();
      
      if (winner === 'X') {
        players[0].winner();
        ScoreBoard.update(players[0].roundsWon(), players[1].roundsWon());
      } else if (winner === 'O') {
          players[1].winner();
          ScoreBoard.update(players[0].roundsWon(), players[1].roundsWon());
        }
      
      if (Gameplay.isDraw()) {
        console.log('is a draw');
      }
    }
    if (Gameplay.isOver()) playButton.innerText = 'Restart';
  }
  if (!Gameplay.isOver() && whoPlay === 'human-computer') {
    return (function () {
      setTimeout(Computer.move, 300);
      Gameboard.update()
    })()
  };
})
