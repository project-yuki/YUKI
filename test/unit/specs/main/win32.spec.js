const Win32Injector = require("inject-loader!../../../../src/main/win32");

describe("Win32", () => {
  let callbackCalled;

  beforeEach(() => {
    callbackCalled = false;
  });

  it("callbacks when registered process exited", () => {
    let registerProcessExitCallback = makeTestingProcessExitCallbackRegister();

    registerProcessExitCallback(PID, () => {
      callbackCalled = true;
    });

    assertCallbackCalledAfterMs(500);
  });

  const makeTestingProcessExitCallbackRegister = () =>
    Win32Injector({
      ffi: {
        Library() {
          return {
            OpenProcess() {},
            WaitForSingleObject: {
              async(hProc, timeout, callback) {
                callback();
              }
            }
          };
        }
      }
    }).registerProcessExitCallback;

  let PID = 100;

  const assertCallbackCalledAfterMs = timeout => {
    setTimeout(() => {
      expect(callbackCalled).to.equal(true);
    }, timeout);
  };
});
