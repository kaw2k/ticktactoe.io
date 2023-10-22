import { Id } from '../utils/Id'
import { Opaque } from '../utils/opaque'

export type PlayerId = Opaque<'PlayerId', Id>
export const PlayerId = () => Id() as PlayerId

export class Player {
  id: PlayerId

  private constructor() {
    this.id = PlayerId()
  }

  static of() {
    return new Player()
  }
}
