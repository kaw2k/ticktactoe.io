import { Game } from './Game/Game'
import { Settings } from './Game/Settings'
import { Token } from './Game/Token'

const canvasContainer = document.getElementById('board-container')!

const game = new Game({
  boardWidth: canvasContainer.clientWidth,
  boardHeight: canvasContainer.clientHeight,
  friction: 0.96,
  acceleration: 1,
  nudgeForce: 2,
})

Settings(game)

const p1 = game.addPlayer()
const token = Token.of('rock', p1.id, [100, 100])
game.addToken(token)
game.start()

/**
 * Handle resizing the canvas
 */
requestAnimationFrame(handleResize)
function handleResize() {
  const height = canvasContainer.clientHeight
  const width = canvasContainer.clientWidth

  if (height !== game.boardHeight || width !== game.boardWidth) {
    game.boardHeight = canvasContainer.clientHeight
    game.boardWidth = canvasContainer.clientWidth

    if (game.canvas) {
      if (
        game.canvas.element.height !== game.boardHeight ||
        game.canvas.element.width !== game.boardWidth
      ) {
        game.canvas.element.width = game.boardWidth
        game.canvas.element.height = game.boardHeight
      }
    }
  }

  requestAnimationFrame(handleResize)
}

/**
 * Temporary arrow key controls for the first token
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    token.act('right', game.nudgeForce)
  }
  if (e.key === 'ArrowLeft') {
    token.act('left', game.nudgeForce)
  }
  if (e.key === 'ArrowDown') {
    token.act('down', game.nudgeForce)
  }
  if (e.key === 'ArrowUp') {
    token.act('up', game.nudgeForce)
  }
})

/**
 * Temporary click to add new tokens
 */
game.canvas?.element.addEventListener('click', (e) => {
  const rect = game.canvas?.element.getBoundingClientRect()
  const x = e.clientX - (rect?.left ?? 0)
  const y = e.clientY - (rect?.top ?? 0)

  const token = Token.of('rock', p1.id, [x, y])
  game.addToken(token)
})
