declare interface RemovedTextThread {
  num: number;
  pid: number;
  hook: number;
  retn: number;
  spl: number;
}

declare interface TextThread extends RemovedTextThread, Object {
  name: string;
  hcode: string;
  str: string;
}
