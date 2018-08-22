export const hooker = require('../../nexthooker')


export interface RemovedTextThread {
  num: number
  pid: number
  hook: number
  retn: number
  spl: number
}

export interface TextThread extends RemovedTextThread {
  name: string
  hcode: string
  str: string
}
