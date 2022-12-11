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

  const array = Array(9).fill(null).map(square);
  array.map((item, index) => item.div.setAttribute('data-index', index));

  return {array, render};
})();

const Gameplay = ( function (board) {

  const activePlayer = (function () {
    let active;
    return function () {
      (active === 'X') ? active = 'O' : active = 'X';
      return active
    }
  })()

  const isOver = function () {
    // Notify if every square of the board is already marked
    return board.every(item => item.mark !== undefined)
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

  return {activePlayer, isOver, winner}
})(Gameboard.array)


Gameboard.render('div.board');

const board = document.querySelector('div.board');

board.addEventListener('pointerdown', (e) => {
  const target = e.target;
  if (!Gameplay.isOver() && target.innerText === ''){
    const index = target.getAttribute('data-index');
    target.innerText = Gameboard.array[index].mark = Gameplay.activePlayer();
    const winner = Gameplay.winner();
    if (winner) {
      console.log(`${winner} player is the winner!`)
    }
  }
})