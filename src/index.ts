import { Game } from './Game/Game'
import { Settings, Tokens } from './Game/Settings'

const canvasContainer = document.getElementById('board-container')!

const game = new Game({
  boardWidth: canvasContainer.clientWidth,
  boardHeight: canvasContainer.clientHeight,
  friction: 0.96,
  nudgeForce: 2,
})

declare global {
  interface Window {
    game: Game
  }
}
window.game = game

Settings(game)
Tokens(game)

/**
 * Handle resizing the canvas
 */
requestAnimationFrame(handleResize)
function handleResize() {
  const height = canvasContainer.offsetHeight
  const width = canvasContainer.clientHeight

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
