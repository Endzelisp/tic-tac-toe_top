const Game = ( function () {

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

  const board = Array(9).fill(null).map(square);

  return {board};
})();

const Gameplay = ( function (boardArray) {

  const activePlayer = (function () {
    let active;
    return function () {
      (active === 'X') ? active = 'O' : active = 'X';
      return active
    }
  })()

  const isOver = function (boardArray) {
    // Notify if every square of the board is already marked
    return boardArray.every(item => item.mark !== null)
  }

  return {activePlayer, isOver}
})(Game.board)