import { Game } from './Game/Game'
import { Token } from './Game/Token'

console.log('Starting simulation...')

const game = Game.of({
  boardWidth: 500,
  boardHeight: 500,
  friction: 0.96,
  acceleration: 1,
  nudgeForce: 2,
})
const p1 = game.addPlayer()

const token = Token.of('rock', p1.id, [100, 100])

game.addToken(token)
game.start()

document.addEventListener('keydown', (e) => {
  e.preventDefault()
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
