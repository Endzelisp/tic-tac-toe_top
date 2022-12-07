const Gameboard = ( function () {

  const square = function (mark = '') {
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

  return Array(9).fill(null).map(square);
})();

