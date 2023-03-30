'use strict'

/* ---------------- Gameboard module ----------------- */

const Gameboard = (function () {
  const array = Array(9).fill(undefined)

  const clear = function () {
    array.fill(undefined)
  }

  return { array, clear }
})()

/* ---------------- Gameplay module ------------------ */

const Gameplay = (function (board) {
  let isActive = false

  const _isBoardFull = function () {
    return board.every((item) => item !== undefined)
  }

  const turn = (function () {
    let active
    return function (restart = undefined) {
      if (restart === undefined) {
        active === 'X' ? (active = 'O') : (active = 'X')
        return active
      } else if (restart === 'restart') {
        active = undefined
      }
    }
  })()

  const isOver = function () {
    // Notify whether every square of the board
    // is already taken or if a player won

    let isOver = _isBoardFull() || !!winner()
    if (isOver) Gameplay.isActive = false
    return isOver
  }

  const isDraw = function () {
    return _isBoardFull() && !winner()
  }

  const winner = function () {
    const [p0, p1, p2, p3, p4, p5, p6, p7, p8] = board

    const _check = function (a, b, c) {
      return a !== undefined && a === b && b === c
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

  return { turn, isOver, winner, isDraw, isActive }
})(Gameboard.array)

/* ---------------- Computer module ------------------ */

const Computer = (function (board) {
  const _selectRandomItem = function (arr) {
    const length = arr.length
    const random = Math.floor(Math.random() * length)
    return arr[random]
  }

  return {}
})(Gameboard.array)

/* ----------------- Players module ------------------ */

const Players = (function () {
  const create = function (name, userMark) {
    let win = 0
    const m = userMark
    const uName = name
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
      get: function () {
        return m
      },
    })

    return newPlayer
  }
  return { create }
})()

/* ------------- User Interface module --------------- */

const UserInterface = (function () {
  const _getElem = function (element) {
    return document.querySelector(element)
  }

  const rootElem = _getElem(':root')
  const modalForm = _getElem('[data-element="modal-form"]')
  const carrousel = _getElem('[data-element="carrousel__form"]')
  const gameSelection = {
    playerVsPlayerBtn: _getElem('[data-button="player-vs-player"]'),
    playerVsComputerBtn: _getElem('[data-button="player-vs-computer"]'),
  }
  const markSelection = {
    form: _getElem('[data-form="player-mark"]'),
    xSelectionBtn: _getElem('[data-mark="x"]'),
    oSelectionBtn: _getElem('[data-mark="o"]'),
  }
  const nameSelection = {
    form: _getElem('[data-form="player-name"]'),
    inputPlayerX: _getElem('[data-input="player-x-name"]'),
    inputPlayerO: _getElem('[data-input="player-o-name"]'),
  }
  const btnBack = _getElem('[data-button="back"]')
  const btnNext = _getElem('[data-button="next"]')
  const playerX = {
    name: _getElem('[data-player="x"] h2'),
    points: _getElem('[data-player="x"] p'),
  }
  const playerO = {
    name: _getElem('[data-player="o"] h2'),
    points: _getElem('[data-player="o"] p'),
  }
  const gameboard = _getElem('[data-element="board"]')

  return {
    rootElem,
    modalForm,
    carrousel,
    gameSelection,
    markSelection,
    nameSelection,
    btnBack,
    btnNext,
    playerX,
    playerO,
    gameboard,
  }
})()

const State = (function () {
  let position = 0
  let arr
  let typeOfGame
  let singlePlayerMark
  const players = {}
  const currentUsers = []

  return {
    position,
    arr,
    typeOfGame,
    singlePlayerMark,
    players,
    currentUsers,
  }
})()

/* --------------- Custom Events ---------------- */

const updateUserInfo = new CustomEvent('updateUserInfo', {
  bubbles: true,
  cancelable: false,
  composed: false,
})

const renderBoard = new CustomEvent('renderBoard', {
  bubbles: true,
  cancelable: false,
  composed: false,
})

/* --------------- Event Handlers ---------------- */

UserInterface.btnNext.addEventListener('pointerdown', function _private() {
  if (
    State.position < State.arr.length - 1 &&
    this.dataset.state === 'active'
  ) {
    ++State.position
    UserInterface.rootElem.style.setProperty(
      '--translate-x',
      `${State.arr[State.position]}`
    )
    this.classList.remove('button-active')
    this.dataset.state = 'inactive'
  }
})

UserInterface.btnBack.addEventListener('pointerdown', function _private() {
  if (State.position > 0) {
    --State.position
    UserInterface.rootElem.style.setProperty(
      '--translate-x',
      `${State.arr[State.position]}`
    )
    if (UserInterface.btnNext.innerText === 'Start') {
      UserInterface.btnNext.innerText = 'next'
      UserInterface.btnNext.classList.remove('button-active')
    }
  }
})

UserInterface.gameSelection.playerVsPlayerBtn.addEventListener(
  'pointerdown',
  function _private() {
    this.classList.add('button-active')
    State.arr = ['0', '-50%']
    UserInterface.markSelection.form.style.display = 'none'
    UserInterface.gameSelection.playerVsComputerBtn.classList.remove(
      'button-active'
    )
    UserInterface.btnNext.classList.add('button-active')
    UserInterface.btnNext.dataset.state = 'active'
    State.typeOfGame = 'player-vs-player'
  }
)

UserInterface.gameSelection.playerVsComputerBtn.addEventListener(
  'pointerdown',
  function _private() {
    this.classList.add('button-active')
    State.arr = ['0', '-33.33%', '-66.66%']
    UserInterface.markSelection.form.style.display = 'grid'
    UserInterface.gameSelection.playerVsPlayerBtn.classList.remove(
      'button-active'
    )
    UserInterface.btnNext.classList.add('button-active')
    UserInterface.btnNext.dataset.state = 'active'
    State.typeOfGame = 'player-vs-computer'
  }
)

UserInterface.markSelection.xSelectionBtn.addEventListener(
  'pointerdown',
  function _private() {
    this.classList.add('button-active')
    UserInterface.markSelection.oSelectionBtn.classList.remove('button-active')
    UserInterface.nameSelection.inputPlayerO.parentElement.classList.add(
      'non-visible'
    )
    UserInterface.nameSelection.inputPlayerX.parentElement.classList.remove(
      'non-visible'
    )
    UserInterface.btnNext.classList.add('button-active')
    UserInterface.btnNext.dataset.state = 'active'
    State.singlePlayerMark = this.dataset.mark
  }
)

UserInterface.markSelection.oSelectionBtn.addEventListener(
  'pointerdown',
  function _private() {
    this.classList.add('button-active')
    UserInterface.markSelection.xSelectionBtn.classList.remove('button-active')
    UserInterface.nameSelection.inputPlayerX.parentElement.classList.add(
      'non-visible'
    )
    UserInterface.nameSelection.inputPlayerO.parentElement.classList.remove(
      'non-visible'
    )
    UserInterface.btnNext.classList.add('button-active')
    UserInterface.btnNext.dataset.state = 'active'
    State.singlePlayerMark = this.dataset.mark
  }
)

UserInterface.nameSelection.form.addEventListener('keydown', () => {
  const playerX = UserInterface.nameSelection.inputPlayerX.value
  const playerO = UserInterface.nameSelection.inputPlayerO.value

  if (
    State.typeOfGame === 'player-vs-player' &&
    playerX !== '' &&
    playerO !== ''
  ) {
    UserInterface.btnNext.innerText = 'Start'
    UserInterface.btnNext.classList.add('button-active')
  }
  if (
    State.typeOfGame === 'player-vs-computer' &&
    State.singlePlayerMark === 'x' &&
    playerX !== ''
  ) {
    UserInterface.btnNext.innerText = 'Start'
    UserInterface.btnNext.classList.add('button-active')
  }
  if (
    State.typeOfGame === 'player-vs-computer' &&
    State.singlePlayerMark === 'o' &&
    playerO !== ''
  ) {
    UserInterface.btnNext.innerText = 'Start'
    UserInterface.btnNext.classList.add('button-active')
  }
})

UserInterface.btnNext.addEventListener('pointerdown', function _private() {
  if (this.innerText === 'Start') {
    if (State.typeOfGame === 'player-vs-player') {
      State.players.playerX = UserInterface.nameSelection.inputPlayerX.value
      State.players.playerO = UserInterface.nameSelection.inputPlayerO.value
    }
    if (State.typeOfGame === 'player-vs-computer') {
      if (State.singlePlayerMark === 'x') {
        State.players.playerX = UserInterface.nameSelection.inputPlayerX.value
        State.players.playerO = 'Computer'
      }
      if (State.singlePlayerMark === 'o') {
        State.players.playerX = 'Computer'
        State.players.playerO = UserInterface.nameSelection.inputPlayerO.value
      }
    }
    State.currentUsers[0] = Players.create(State.players.playerX, 'x')
    State.currentUsers[1] = Players.create(State.players.playerO, 'o')
    UserInterface.rootElem.dispatchEvent(updateUserInfo)
    UserInterface.modalForm.remove()
  }
})

UserInterface.rootElem.addEventListener('updateUserInfo', () => {
  UserInterface.playerX.name.innerText = State.players.playerX
  UserInterface.playerO.name.innerText = State.players.playerO
})

UserInterface.gameboard.addEventListener('pointerdown', function _private(e) {
  const target = e.target
  const turn = Gameplay.turn()
  if (Gameboard.array[target.dataset.index] === undefined) {
    Gameboard.array[target.dataset.index] = turn
  }
  this.dispatchEvent(renderBoard)
})

UserInterface.rootElem.addEventListener('renderBoard', () => {
  const gameCellsArr = [...UserInterface.gameboard.querySelectorAll('div')]
  Gameboard.array.forEach((item, index) => {
    if (item !== undefined) {
      gameCellsArr[index].innerText = item
    }
  })
})
