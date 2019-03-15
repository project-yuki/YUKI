const Win32Injector = require('inject-loader!../../../../src/main/win32')
import { expect } from 'chai'

describe('Win32', () => {
  let callbackCalled

  beforeEach(() => {
    callbackCalled = false
  })

  it('callbacks when registered process exited', () => {
    const registerProcessExitCallback = makeTestingProcessExitCallbackRegister()

    registerProcessExitCallback(PID, () => {
      callbackCalled = true
    })

    assertCallbackCalledAfterMs(500)
  })

  const makeTestingProcessExitCallbackRegister = () =>
    Win32Injector({
      ffi: {
        Library () {
          return {
            OpenProcess () {
              return
            },
            WaitForSingleObject: {
              async (hProc, timeout, callback) {
                callback()
              }
            }
          }
        }
      }
    }).registerProcessExitCallback

  const PID = 100

  const assertCallbackCalledAfterMs = (timeout) => {
    setTimeout(() => {
      expect(callbackCalled).to.equal(true)
    }, timeout)
  }
})
