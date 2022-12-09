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

  return {activePlayer, isOver}
})(Gameboard.array)


Gameboard.render('div.board');