import { Player } from './Player'
import { Token } from './Token'

// Top Left is 0, 0

export class Game {
  ctx: CanvasRenderingContext2D | null = null
  stepNumber: number = 0
  intervalId: number = 0

  players: Player[] = []
  tokens: Token[] = []

  // Settings
  boardWidth: number = 500
  boardHeight: number = 500
  friction: number = 0.8
  nudgeForce: number = 1
  acceleration: number = 1
  actionsPerStep: number = 1

  private constructor({
    boardWidth,
    boardHeight,
    friction,
    nudgeForce,
    acceleration,
    actionsPerStep,
    render,
  }: {
    boardWidth: number
    boardHeight: number
    friction: number
    nudgeForce: number
    acceleration: number
    actionsPerStep: number
    render: boolean
  }) {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    this.friction = friction
    this.nudgeForce = nudgeForce
    this.acceleration = acceleration
    this.actionsPerStep = actionsPerStep

    if (render) {
      const boardContainer = document.getElementById('board-container')!
      const board = document.createElement('canvas')
      board.width = this.boardWidth
      board.height = this.boardHeight
      boardContainer.appendChild(board)
      this.ctx = board.getContext('2d')!
    }
  }

  static of({
    boardWidth = 500,
    boardHeight = 500,
    friction = 1,
    nudgeForce = 1,
    acceleration = 1,
    actionsPerStep = 1,
    render = true,
  }: {
    boardWidth?: number
    boardHeight?: number
    friction?: number
    nudgeForce?: number
    acceleration?: number
    actionsPerStep?: number
    render?: boolean
  }) {
    return new Game({
      acceleration,
      actionsPerStep,
      boardHeight,
      boardWidth,
      friction,
      nudgeForce,
      render,
    })
  }

  step() {
    this.tokens.forEach((token) => {
      token.updateLocation(this.friction)
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
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight)
    this.tokens.forEach((token) => {
      token.render(this.ctx!)
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
