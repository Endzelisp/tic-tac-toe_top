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

  const array = Array(9).fill(null).map(square);
  array.map((item, index) => item.div.setAttribute('data-index', index));

  return {array, render, clear};
})();

const Gameplay = ( function (board) {

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
    
    return (isBoardFull()) || (!!winner())
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
    if (check(p2.mark, p5.mark, p8.mark)) return p6.mark
    if (check(p0.mark, p4.mark, p8.mark)) return p0.mark
    if (check(p2.mark, p4.mark, p6.mark)) return p2.mark
  }

  return {activePlayer, isOver, winner, isDraw}
})(Gameboard.array)

const ScoreBoard = (function(selector) {
  const board = document.querySelector(selector);
  const playerX = board.querySelector('[data-player="X"]');
  const playerO = board.querySelector('[data-player="O"]');
  const scoreX = board.querySelector('[data-score="X"]');
  const scoreO = board.querySelector('[data-score="O"]');
  
  function setPlayer (str) {
    if (str === 'human-computer') {
      playerX.innerText = 'Player';
      playerO.innerText = 'Computer';
    }
    if (str === 'human-human') {
      playerX.innerText = 'Player X';
      playerO.innerText = 'Player O';
    }
  }

  return {setPlayer}  
})('div.score-board')

function playerCreator (playerMark) {
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

// * ---------------* //
// START main program //
// * ---------------* //

Gameboard.render('div.board');


const board = document.querySelector('div.board');
const playerSelection = document.querySelector('div.player-controls > select');
const playButton = document.querySelector('div.player-controls > button');

playButton.addEventListener('pointerdown', () => {
  let whoPlay = playerSelection.value;
  ScoreBoard.setPlayer(whoPlay);
})

board.addEventListener('pointerdown', (e) => {
  const target = e.target;
  if (!Gameplay.isOver() && target.innerText === ''){
    const index = target.getAttribute('data-index');
    target.innerText = Gameboard.array[index].mark = Gameplay.activePlayer();
    const winner = Gameplay.winner();
    
    if (winner) {console.log(`${winner} player is the winner!`)}
    if (Gameplay.isDraw()) {console.log('is a draw')}
  }
})