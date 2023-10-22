import { Player } from './Player'
import { Token } from './Token'

// Top Left is 0, 0

export interface GameSettings {
  boardWidth: number
  boardHeight: number
  friction: number
  nudgeForce: number
  acceleration: number
  actionsPerStep: number
  render: boolean
  collisionDampening: number
}

export class Game {
  canvas: {
    element: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
  } | null = null
  stepNumber: number = 0
  intervalId: number = 0

  players: Player[] = []
  tokens: Token[] = []

  // Settings
  boardWidth: number
  boardHeight: number
  friction: number
  nudgeForce: number
  acceleration: number
  actionsPerStep: number
  collisionDampening: number

  constructor({
    boardWidth = 500,
    boardHeight = 500,
    friction = 1,
    nudgeForce = 1,
    acceleration = 1,
    actionsPerStep = 1,
    collisionDampening = 0.25,
    render = true,
  }: Partial<GameSettings>) {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    this.friction = friction
    this.nudgeForce = nudgeForce
    this.acceleration = acceleration
    this.actionsPerStep = actionsPerStep
    this.collisionDampening = collisionDampening

    if (render) {
      const boardContainer = document.getElementById('board-container')!
      const board = document.createElement('canvas')
      board.width = this.boardWidth
      board.height = this.boardHeight
      boardContainer.appendChild(board)
      this.canvas = {
        element: board,
        ctx: board.getContext('2d')!,
      }
    }
  }

  step() {
    this.tokens.forEach((token) => {
      token.updateLocation({
        friction: this.friction,
        boardHeight: this.boardHeight,
        boardWidth: this.boardWidth,
        collisionDampening: this.collisionDampening,
      })
    })
  }

  addPlayer(player: Player = Player.of()) {
    this.players.push(player)
    return player
  }

  addToken(token: Token) {
    this.tokens.push(token)
  }

  render() {
    if (!this.canvas) return
    const canvas = this.canvas

    canvas.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight)
    this.tokens.forEach((token) => {
      token.render(canvas.ctx)
    })
  }

  start() {
    this.intervalId = setInterval(() => {
      this.step()
      this.render()
    }, 1000 / 60)
  }

  stop() {
    clearInterval(this.intervalId)
  }
}
