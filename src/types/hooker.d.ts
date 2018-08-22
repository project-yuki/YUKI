declare interface RemovedTextThread {
  num: number
  pid: number
  hook: number
  retn: number
  spl: number
}

declare interface TextThread extends RemovedTextThread {
  name: string
  hcode: string
  str: string
}
