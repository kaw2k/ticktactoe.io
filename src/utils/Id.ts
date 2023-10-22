import { Opaque } from './opaque'
export type Id = Opaque<'id', string>
export const Id = () => [rand(), rand(), rand(), rand()].join('-') as Id

const rand = () => Math.round(Math.random() * 10000000).toString()
