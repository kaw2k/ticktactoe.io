import { Forces } from '../utils/Forces'
import { Position } from '../utils/Position'
import { PlayerId } from './Players/Player'

export type TokenType = 'rock' | 'paper' | 'scissors'
export type IntersectionProtocol = 'capture' | 'destroy' | 'consume'

export class Token {
  type: TokenType
  owner: PlayerId
  radius: number = 10
  position: Position
  forces: Forces = [0, 0]
  actedThisStep: boolean = false
  intersectionProtocol: IntersectionProtocol

  private get symbol() {
    switch (this.type) {
      case 'paper':
        return '📄'
      case 'rock':
        return '🪨'
      case 'scissors':
        return '✂️'
    }
  }

  private isConqueredBy(other: Token) {
    return (
      (this.type === 'rock' && other.type === 'paper') ||
      (this.type === 'paper' && other.type === 'scissors') ||
      (this.type === 'scissors' && other.type === 'rock')
    )
  }

  private constructor(
    type: TokenType,
    owner: PlayerId,
    position: Position,
    intersectionProtocol: IntersectionProtocol
  ) {
    this.type = type
    this.owner = owner
    this.position = position
    this.intersectionProtocol = intersectionProtocol
  }

  static of(
    owner: PlayerId,
    position: Position,
    type: TokenType = Token.randomType(),
    intersectionProtocol: IntersectionProtocol = 'capture'
  ) {
    return new Token(type, owner, position, intersectionProtocol)
  }

  static randomType(): TokenType {
    const types = ['rock', 'paper', 'scissors'] as const
    return types[Math.floor(Math.random() * 3)]
  }

  act(direction: 'left' | 'right' | 'up' | 'down', nudgeForce: number) {
    switch (direction) {
      case 'left':
        this.forces[0] -= nudgeForce
        break
      case 'right':
        this.forces[0] += nudgeForce
        break
      case 'up':
        this.forces[1] -= nudgeForce
        break
      case 'down':
        this.forces[1] += nudgeForce
        break
    }

    this.actedThisStep = true
  }

  /**
   * <= 0 if the two tokens intersect
   */
  intersects(other: Token): number {
    const radii = this.radius + other.radius
    const hypotenuse = Math.hypot(
      this.position[0] - other.position[0],
      this.position[1] - other.position[1]
    )

    return hypotenuse - radii
  }

  updateLocation({
    friction,
    boardHeight,
    boardWidth,
    collisionDampening,
  }: {
    friction: number
    boardHeight: number
    boardWidth: number
    collisionDampening: number
  }) {
    this.position = [
      this.position[0] + this.forces[0],
      this.position[1] + this.forces[1],
    ]

    const hasHitBoundary =
      this.position[0] < 0 ||
      this.position[0] > boardWidth ||
      this.position[1] < 0 ||
      this.position[1] > boardHeight

    if (hasHitBoundary) {
      const deltaX =
        this.position[0] < 0
          ? this.position[0]
          : this.position[0] - boardWidth > 0
          ? this.position[0] - boardWidth
          : 0
      const deltaY =
        this.position[1] < 0
          ? this.position[1]
          : this.position[1] - boardHeight > 0
          ? this.position[1] - boardHeight
          : 0

      if (deltaX !== 0) {
        this.position[0] -= deltaX
        this.forces[0] = -(1 - collisionDampening) * this.forces[0]
      }
      if (deltaY !== 0) {
        this.position[1] -= deltaY
        this.forces[1] = -(1 - collisionDampening) * this.forces[1]
      }
    }

    this.forces = [this.forces[0] * friction, this.forces[1] * friction]
  }

  applyOverlappingForces(tokens: Token[]) {
    tokens
      .filter((token) => token !== this && this.intersects(token) <= 0)
      .forEach((token) => {
        // const intersection = this.intersects(token)
        // console.log(intersection)
        // const p1 = token.position
        // const p2 = this.position
        // const m = (p2[1] - p1[1]) / (p2[0] - p1[0])
        // const b = p1[1] - m * p1[0]
        // const x1 =
        // y = mx + b
        // x = (y - b) / m
        // this.forces[0] += m * intersection
        // this.forces[1] += m * intersection
      })
  }

  settleIntersections(tokens: Token[]) {
    tokens
      .filter((token) => token !== this && this.intersects(token) <= 0)
      .sort((a, b) => this.intersects(a) - this.intersects(b))
      .some((token) => {
        if (this.isConqueredBy(token)) {
          if (this.intersectionProtocol === 'capture') {
            this.owner = token.owner
            this.type = token.type
          } else if (this.intersectionProtocol === 'consume') {
            token.growFromConsuming(this)
          } else if (this.intersectionProtocol === 'destroy') {
            this.destroy()
          }

          return true
        }
      })
  }

  growFromConsuming(other: Token) {
    this.radius += other.radius / 2
    other.destroy()
  }

  destroy() {
    window.game.removeToken(this)
  }

  endStep() {
    this.actedThisStep = false
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw an emoji
    ctx.save()
    ctx.translate(this.position[0], this.position[1])
    ctx.rotate(-Math.PI / 2)
    ctx.rotate(Math.atan2(this.forces[1], this.forces[0]))
    ctx.translate(-this.position[0], -this.position[1])
    ctx.font = `${this.radius * 1.7}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.symbol, ...this.position)
    ctx.restore()
  }
}
