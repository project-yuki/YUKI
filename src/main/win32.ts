import * as ffi from 'ffi'
const debug = require('debug')('yuki:win32')

const SYNCHRONIZE = 0x00100000
const FALSE = 0
const INFINITE = 0xffffffff

const knl32 = ffi.Library('kernel32.dll', {
  OpenProcess: ['uint32', ['uint32', 'int', 'uint32']],
  WaitForSingleObject: ['uint32', ['uint32', 'uint32']]
})

export function registerProcessExitCallback (
  pids: number[],
  callback: () => void
): void {
  doRegister(pids, callback, 0)
}

function doRegister (pids: number[], callback: () => void, index: number) {
  if (index === pids.length) {
    callback()
    return
  }

  debug('registering process exit callback at pid %d...', pids[index])

  const hProc = knl32.OpenProcess(SYNCHRONIZE, FALSE, pids[index])
  debug('process handle: %d', hProc)

  knl32.WaitForSingleObject.async(hProc, INFINITE, () => {
    doRegister(pids, callback, index + 1)
  })
  debug('process exit callback registered')
}
