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

