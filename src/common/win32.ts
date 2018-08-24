import * as ref from "ref";
import * as ffi from "ffi";
import logger from "./logger";

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
  logger.debug(`registering process exit callback at pid ${pid}...`);

  hProc = knl32.OpenProcess(SYNCHRONIZE, FALSE, pid);
  logger.debug(`process handle: ${hProc}`);

  knl32.WaitForSingleObject.async(hProc, INFINITE, () => {
    callback();
  });
  console.log("process exit callback registered");
}
