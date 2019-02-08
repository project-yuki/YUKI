import * as ffi from "ffi";
const debug = require("debug")("yagt:win32");

const SYNCHRONIZE = 0x00100000;
const FALSE = 0;
const INFINITE = 0xffffffff;

const knl32 = ffi.Library("kernel32.dll", {
  OpenProcess: ["uint32", ["uint32", "int", "uint32"]],
  WaitForSingleObject: ["uint32", ["uint32", "uint32"]]
});

let hProc: Buffer;

export function registerProcessExitCallback(
  pid: number,
  callback: () => void
): void {
  debug("registering process exit callback at pid %d...", pid);

  hProc = knl32.OpenProcess(SYNCHRONIZE, FALSE, pid);
  debug("process handle: %d", hProc);

  knl32.WaitForSingleObject.async(hProc, INFINITE, () => {
    callback();
  });
  debug("process exit callback registered");
}
