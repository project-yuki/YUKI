import ipcTypes from "../../../../src/common/ipcTypes";

const HookerInjector = require("inject-loader!../../../../src/main/hooker");

describe("Hooker", () => {
  let sendedCount;
  let hookerCallback;

  beforeEach(() => {
    sendedCount = 0;
    hookerCallback = null;
  });

  it("publishes to single subscriber on event emitted", done => {
    const hooker = makeTestingHooker().getInstance();

    hooker.subscribe("thread-remove", newFakeWebContents());
    assertSendedCountEquals(1, done);
  });

  const makeTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          setTimeout(() => {
            callback({
              test: 0
            });
          }, 100);
        },
        start() {},
        onThreadCreate() {},
        onProcessAttach() {},
        onProcessDetach() {}
      },
      "../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  const newFakeWebContents = () =>
    Object.assign({}, fakeWebContentsCheckingTypeAndArgsAndAddSendedCount);

  const fakeWebContentsCheckingTypeAndArgsAndAddSendedCount = {
    send(type, ...args) {
      expect(type).to.equal(ipcTypes.HAS_REMOVED_HOOK);
      expect(args[0]).to.deep.equal({ test: 0 });
      sendedCount++;
    },
    getTitle() {}
  };

  const assertSendedCountEquals = (count, done) => {
    setTimeout(() => {
      expect(sendedCount).to.equal(count);
      done();
    }, 100);
  };

  it("do not register two same subscriber", done => {
    const hooker = makeTestingHooker().getInstance();

    hooker.subscribe(
      "thread-remove",
      fakeWebContentsCheckingTypeAndArgsAndAddSendedCount
    );
    hooker.subscribe(
      "thread-remove",
      fakeWebContentsCheckingTypeAndArgsAndAddSendedCount
    );
    assertSendedCountEquals(1, done);
  });

  it("do not unsubscribe non-exist web contents", done => {
    const hooker = makeTestingHooker().getInstance();

    hooker.unsubscribe("thread-remove", newFakeWebContents());
    assertSendedCountEquals(0, done);
  });

  it("do not register at non-exist event", done => {
    const hooker = makeTestingHooker().getInstance();

    hooker.subscribe("non-exist-event", newFakeWebContents());
    assertSendedCountEquals(0, done);
  });

  it("publishes to multiple subscribers on event emitted", done => {
    const hooker = makeTestingHooker().getInstance();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());

    assertSendedCountEquals(3, done);
  });

  it("only publishes to subscribed, not unsubscribed, on event emitted", done => {
    const hooker = makeTestingHooker().getInstance();

    let toUnsubscibeFakeWebContents = newFakeWebContents();

    hooker.subscribe("thread-remove", toUnsubscibeFakeWebContents);
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.unsubscribe(toUnsubscibeFakeWebContents);

    assertSendedCountEquals(3, done);
  });

  it("injects process and publish to subscribers", done => {
    const hooker = makeInjectProcessTestingHooker().getInstance();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.injectProcess(PID);

    assertSendedCountEquals(1, done);
  });

  const makeInjectProcessTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        injectProcess() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {},
        onProcessAttach() {},
        onProcessDetach() {}
      },
      "../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  const PID = 100;

  it("detaches process and publish to subscribers", done => {
    const hooker = makeDetachProcessTestingHooker().getInstance();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.detachProcess(PID);

    assertSendedCountEquals(1, done);
  });

  const makeDetachProcessTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        detachProcess() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {},
        onProcessAttach() {},
        onProcessDetach() {}
      },
      "../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  it("inserts hook and publish to subscribers", done => {
    const hooker = makeInsertHookTestingHooker().getInstance();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.insertHook(PID);

    assertSendedCountEquals(1, done);
  });

  const makeInsertHookTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        insertHook() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {},
        onProcessAttach() {},
        onProcessDetach() {}
      },
      "../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;
});
