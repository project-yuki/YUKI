declare namespace Yagt {
  export interface RemovedTextThread {
    num: number;
    pid: number;
    hook: number;
    retn: number;
    spl: number;
  }

  export interface TextThread extends RemovedTextThread, Object {
    name: string;
    hcode: string;
  }

  export interface Hooker {
    start: () => void;
    open: () => void;
    onProcessAttach: (callback: (pid: number) => void) => void;
    onProcessDetach: (callback: (pid: number) => void) => void;
    onThreadCreate: (
      threadCreatedCallback: (thread: Yagt.TextThread) => void,
      textGetCallback: (thread: Yagt.TextThread, text: string) => void
    ) => void;
    onThreadRemove: (
      callback: (thread: Yagt.RemovedTextThread) => void
    ) => void;
    injectProcess: (pid: number) => void;
    detachProcess: (pid: number) => void;
    insertHook: (pid: number, code: string) => void;
  }
}
