const Gameboard = ( function () {

  const square = function (mark) {
    let squareMark = mark;
    return {
      get mark () {
        return squareMark;
      },
      set mark (mark) {
        squareMark = mark;
      },
    }
  }

  const array = Array(9).fill(null).map(square);

  return {array};
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
    return board.every(item => item.mark !== null)
  }

  return {activePlayer, isOver}
})(Gameboard.array)