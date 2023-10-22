import { Forces } from '../utils/Forces'
import { Position } from '../utils/Position'
import { PlayerId } from './Player'

export type TokenType = 'rock' | 'paper' | 'scissors'

export class Token {
  type: TokenType
  owner: PlayerId
  radius: number = 20
  position: Position
  forces: Forces = [0, 0]

  private get symbol() {
    switch (this.type) {
      case 'paper':
        return '📃'
      case 'rock':
        return '🪨'
      case 'scissors':
        return '✂️'
    }
  }

  private constructor(type: TokenType, owner: PlayerId, position: Position) {
    this.type = type
    this.owner = owner
    this.position = position
  }

  static of(type: TokenType, owner: PlayerId, position: Position) {
    return new Token(type, owner, position)
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

    this.forces = [
      clampFriction(this.forces[0] * friction),
      clampFriction(this.forces[1] * friction),
    ]
  }

  settleIntersections(tokens: Token[]) {
    tokens
      .filter((token) => token !== this && this.intersects(token) <= 0)
      .sort((a, b) => this.intersects(a) - this.intersects(b))
      .forEach((token) => {})
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    // ctx.translate(this.radius * 0.5, this.radius * 0.5)
    // ctx.rotate(Math.atan2(this.forces[1], this.forces[0]) * Math.PI * 0.5)
    // ctx.translate(-this.radius * 0.5, -this.radius * 0.5)

    // ctx.translate(...this.position)
    // Have the image face the direction of the velocity
    // ctx.rotate(  Math.PI / 180)
    // ctx.rotate(Math.atan2(this.forces[1], this.forces[0]))
    ctx.font = `${this.radius}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.symbol, ...this.position)
    // ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.restore()
  }
}

function clampFriction(vd: number) {
  // if (Math.abs(vd) < 0.01) return 0
  return vd
}
