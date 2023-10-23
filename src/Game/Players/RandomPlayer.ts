import { Game } from '../Game'
import { Player } from './Player'

export class RandomPlayer extends Player {
  constructor() {
    super()
  }

  static of() {
    return new RandomPlayer()
  }

  act(numActions: number, game: Readonly<Game>): void {
    for (let i = 0; i < numActions; i++) {
      const tokens = game.tokens.filter((t) =>
        t.owner === this.id && game.repeatNudges ? true : !t.actedThisStep
      )
      const token = tokens[Math.floor(Math.random() * tokens.length)]

      if (token) {
        const directions = ['left', 'right', 'up', 'down'] as const
        const direction = directions[Math.floor(Math.random() * 4)]
        token.act(direction, game.nudgeForce)
      }
    }
  }
}
