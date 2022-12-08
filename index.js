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

  const isOver = function () {
    // Notify if every square of the board is already marked
    return board.every(item => item.mark !== null)
  }

  const board = Array(9).fill(null).map(square);

  return {board, isOver};
})();

