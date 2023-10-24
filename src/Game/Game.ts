import { Player } from './Players/Player'
import { Token } from './Token'

// Top Left is 0, 0

export interface GameSettings {
  boardWidth: number
  boardHeight: number
  friction: number
  nudgeForce: number
  actionsPerStep: number
  render: boolean
  collisionDampening: number
  repeatNudges: boolean
  stepsPerSecond: number
}

export class Game {
  canvas: {
    element: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
  } | null = null
  stepNumber: number = 0
  intervalId: number = 0
  gameActive = false

  players: Player[] = []
  tokens: Token[] = []

  // Settings
  boardWidth: number
  boardHeight: number
  friction: number
  nudgeForce: number
  actionsPerStep: number
  collisionDampening: number
  repeatNudges: boolean
  stepsPerSecond: number

  constructor({
    boardWidth = 500,
    boardHeight = 500,
    friction = 1,
    nudgeForce = 1,
    actionsPerStep = 1,
    collisionDampening = 0.25,
    render = true,
    repeatNudges = false,
    stepsPerSecond = 30,
  }: Partial<GameSettings>) {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    this.friction = friction
    this.nudgeForce = nudgeForce
    this.actionsPerStep = actionsPerStep
    this.collisionDampening = collisionDampening
    this.repeatNudges = repeatNudges
    this.stepsPerSecond = stepsPerSecond

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

    this.gameLoop()
  }

  gameLoop() {
    this.step()
    setTimeout(this.gameLoop.bind(this), 1000 / this.stepsPerSecond)
  }

  step() {
    if (this.gameActive) {
      this.players.forEach((player) => {
        player.act(this.actionsPerStep, this)
      })

      this.tokens.forEach((token) => {
        token.updateLocation({
          friction: this.friction,
          boardHeight: this.boardHeight,
          boardWidth: this.boardWidth,
          collisionDampening: this.collisionDampening,
        })
      })

      this.tokens.forEach((token) => {
        token.settleIntersections(this.tokens)
      })

      this.tokens.forEach((token) => {
        token.applyOverlappingForces(this.tokens)
      })

      this.tokens.forEach((token) => {
        token.endStep()
      })
    }

    this.render()
  }

  randomPosition(): [number, number] {
    return [
      Math.floor(Math.random() * this.boardWidth),
      Math.floor(Math.random() * this.boardHeight),
    ]
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
    this.gameActive = true
  }

  stop() {
    this.gameActive = false
  }
}
