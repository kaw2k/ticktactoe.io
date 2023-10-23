import { Id } from '../../utils/Id'
import { Opaque } from '../../utils/opaque'
import { Game } from '../Game'

export type PlayerId = Opaque<'PlayerId', Id>
export const PlayerId = () => Id() as PlayerId

export class Player {
  id: PlayerId

  constructor() {
    this.id = PlayerId()
  }

  static of() {
    return new Player()
  }

  act(numActions: number, game: Readonly<Game>) {}
}
