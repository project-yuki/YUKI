import ipcTypes from "../../../../src/common/ipcTypes";

const HookerInjector = require("inject-loader!../../../../src/main/hooker");

describe("Hooker", () => {
  let sendedCount;
  let hookerCallback;

  beforeEach(() => {
    sendedCount = 0;
    hookerCallback = null;
  });

  it("publishes to single subscriber on event emitted", () => {
    const hooker = makeTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    assertSendedCountEquals(1);
  });

  const makeTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          setTimeout(
            () =>
              callback({
                test: 0
              }),
            500
          );
        },
        start() {},
        open() {},
        onThreadCreate() {}
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

  const assertSendedCountEquals = count => {
    setTimeout(() => {
      expect(sendedCount).to.equal(count);
    }, 500);
  };

  it("do not register two same subscriber", () => {
    const hooker = makeTestingHooker();

    hooker.subscribe(
      "thread-remove",
      fakeWebContentsCheckingTypeAndArgsAndAddSendedCount
    );
    hooker.subscribe(
      "thread-remove",
      fakeWebContentsCheckingTypeAndArgsAndAddSendedCount
    );
    assertSendedCountEquals(1);
  });

  it("do not unsubscribe non-exist web contents", () => {
    const hooker = makeTestingHooker();

    hooker.unsubscribe("thread-remove", newFakeWebContents());
    assertSendedCountEquals(0);
  });

  it("do not register at non-exist event", () => {
    const hooker = makeTestingHooker();

    hooker.subscribe("non-exist-event", newFakeWebContents());
    assertSendedCountEquals(0);
  });

  it("publishes to multiple subscribers on event emitted", () => {
    const hooker = makeTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());

    assertSendedCountEquals(3);
  });

  it("only publishes to subscribed, not unsubscribed, on event emitted", () => {
    const hooker = makeTestingHooker();

    let toUnsubscibeFakeWebContents = newFakeWebContents();

    hooker.subscribe("thread-remove", toUnsubscibeFakeWebContents);
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.unsubscribe(toUnsubscibeFakeWebContents);

    assertSendedCountEquals(2);
  });

  it("injects process and publish to subscribers", () => {
    const hooker = makeInjectProcessTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.injectProcess(PID);

    assertSendedCountEquals(1);
  });

  const makeInjectProcessTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        open() {},
        injectProcess() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {}
      }
    }).default;

  const PID = 100;

  it("detaches process and publish to subscribers", () => {
    const hooker = makeDetachProcessTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.detachProcess(PID);

    assertSendedCountEquals(1);
  });

  const makeDetachProcessTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        open() {},
        detachProcess() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {}
      }
    }).default;

  it("inserts hook and publish to subscribers", () => {
    const hooker = makeInsertHookTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.insertHook(PID);

    assertSendedCountEquals(1);
  });

  const makeInsertHookTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        open() {},
        insertHook() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {}
      }
    }).default;

  it("removes hook and publish to subscribers", () => {
    const hooker = makeRemoveHookTestingHooker();

    hooker.subscribe("thread-remove", newFakeWebContents());
    hooker.removeHook(PID);

    assertSendedCountEquals(1);
  });

  const makeRemoveHookTestingHooker = () =>
    HookerInjector({
      "../../nexthooker": {
        onThreadRemove(callback) {
          hookerCallback = callback;
        },
        start() {},
        open() {},
        removeHook() {
          hookerCallback({ test: 0 });
        },
        onThreadCreate() {}
      }
    }).default;
});
