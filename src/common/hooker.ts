import types from "../common/ipcTypes";
import logger from "../common/logger";

class HookerPublisher {
  private _subscribers: Electron.WebContents[] = [];
  private _type: string;
  constructor(type: string) {
    this._type = type;
  }

  public subscribe(webContents: Electron.WebContents) {
    if (this._subscribers.find(value => value === webContents)) {
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] already subscribed type [${
          this._type
        }]`
      );
    } else {
      this._subscribers.push(webContents);
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] successfully subscribed type [${
          this._type
        }]`
      );
    }
  }

  public unsubscribe(webContents: Electron.WebContents) {
    if (!this._subscribers.find(value => value === webContents)) {
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] hasn't subscribed type [${
          this._type
        }]`
      );
    } else {
      this._subscribers.filter(subscriber => subscriber !== webContents);
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] successfully unsubscribed type [${
          this._type
        }]`
      );
    }
  }

  public publish(...args: any[]) {
    for (let subscriber of this._subscribers) {
      subscriber.send(this._type, ...args);
    }
  }
}

interface PublisherMap {
  ["thread-create"]: HookerPublisher;
  ["thread-remove"]: HookerPublisher;
  ["thread-output"]: HookerPublisher;
}

class Hooker {
  private _hooker: Yagt.Hooker = require("../../nexthooker");

  private _threadCreatePublisher = new HookerPublisher(types.HAS_INSERTED_HOOK);
  private _threadRemovePublisher = new HookerPublisher(types.HAS_REMOVED_HOOK);
  private _threadOutputPublisher = new HookerPublisher(types.HAS_HOOK_TEXT);

  constructor() {
    this._hooker.start();
    this._initHookerCallbacks();
    this._hooker.open();
  }

  private _initHookerCallbacks() {
    this._hooker.onThreadCreate(
      (tt: Yagt.TextThread) => {
        logger.debug("hooker: thread created");
        logger.debug(tt);
        this._threadCreatePublisher.publish(tt);
      },
      (tt: Yagt.TextThread, text: string) => {
        logger.debug(`hooker: [${tt.num}]: ${text}`);
        this._threadOutputPublisher.publish(tt, text);
      }
    );
    this._hooker.onThreadRemove((tt: Yagt.RemovedTextThread) => {
      logger.debug("hooker: thread removed");
      logger.debug(tt);
      this._threadRemovePublisher.publish(tt);
    });
  }

  private _publisherMap: PublisherMap = {
    ["thread-create"]: this._threadCreatePublisher,
    ["thread-remove"]: this._threadRemovePublisher,
    ["thread-output"]: this._threadOutputPublisher
  };

  public subscribe(on: keyof PublisherMap, webContents: Electron.WebContents) {
    if (!this._publisherMap[on]) {
      logger.debug(`hooker: trying to register unknown event ${on}`);
    } else {
      this._publisherMap[on].subscribe(webContents);
    }
  }

  public unsubscribe(on: string, webContents: Electron.WebContents) {
    if (!this._publisherMap[on]) {
      logger.debug(`hooker: trying to unregister unknown event ${on}`);
    } else {
      this._publisherMap[on].unsubscribe(webContents);
    }
  }

  public injectProcess(pid: number) {
    this._hooker.injectProcess(pid);
  }

  public detachProcess(pid: number) {
    this._hooker.detachProcess(pid);
  }

  public insertHook(pid: number, code: string) {
    this._hooker.insertHook(pid, code);
  }

  public removeHook(pid: number, hook: number) {
    this._hooker.removeHook(pid, hook);
  }
}

let instance = new Hooker();

export default instance;
