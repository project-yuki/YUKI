import types from "../common/ipcTypes";
import logger from "../common/logger";

class HookerPublisher {
  private subscribers: Electron.WebContents[] = [];
  private type: string;
  constructor(type: string) {
    this.type = type;
  }

  public subscribe(webContents: Electron.WebContents) {
    if (this.subscribers.find(value => value === webContents)) {
      logger.error(
        `HookerPublisher: webContents [${webContents.getTitle()}] already subscribed type [${
          this.type
        }]`
      );
    } else {
      this.subscribers.push(webContents);
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] successfully subscribed type [${
          this.type
        }]`
      );
    }
  }

  public unsubscribe(webContents: Electron.WebContents) {
    if (!this.subscribers.find(value => value === webContents)) {
      logger.error(
        `HookerPublisher: webContents [${webContents.getTitle()}] hasn't subscribed type [${
          this.type
        }]`
      );
    } else {
      this.subscribers = this.subscribers.filter(
        subscriber => subscriber !== webContents
      );
      logger.debug(
        `HookerPublisher: webContents [${webContents.getTitle()}] successfully unsubscribed type [${
          this.type
        }]`
      );
    }
  }

  public publish(...args: any[]) {
    for (let subscriber of this.subscribers) {
      subscriber.send(this.type, ...args);
    }
  }
}

interface PublisherMap {
  ["thread-create"]: HookerPublisher;
  ["thread-remove"]: HookerPublisher;
  ["thread-output"]: HookerPublisher;
}

class Hooker {
  private hooker: Yagt.Hooker = require("../../nexthooker");

  constructor() {
    this.hooker.start();
    this.initHookerCallbacks();
    this.hooker.open();
  }

  private initHookerCallbacks() {
    this.hooker.onThreadCreate(
      (tt: Yagt.TextThread) => {
        logger.debug("hooker: thread created");
        logger.debug(tt);
        this.publisherMap["thread-create"].publish(tt);
      },
      (tt: Yagt.TextThread, text: string) => {
        logger.debug(`hooker: [${tt.num}]: ${text}`);
        this.publisherMap["thread-output"].publish(tt, text);
      }
    );
    this.hooker.onThreadRemove((tt: Yagt.RemovedTextThread) => {
      logger.debug("hooker: thread removed");
      logger.debug(tt);
      this.publisherMap["thread-remove"].publish(tt);
    });
  }

  private publisherMap: PublisherMap = {
    "thread-create": new HookerPublisher(types.HAS_INSERTED_HOOK),
    "thread-remove": new HookerPublisher(types.HAS_REMOVED_HOOK),
    "thread-output": new HookerPublisher(types.HAS_HOOK_TEXT)
  };

  public subscribe(on: keyof PublisherMap, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      logger.error(`hooker: trying to register unknown event ${on}`);
    } else {
      this.publisherMap[on].subscribe(webContents);
    }
  }

  public unsubscribe(on: string, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      logger.error(`hooker: trying to unregister unknown event ${on}`);
    } else {
      this.publisherMap[on].unsubscribe(webContents);
    }
  }

  public injectProcess(pid: number) {
    this.hooker.injectProcess(pid);
  }

  public detachProcess(pid: number) {
    this.hooker.detachProcess(pid);
  }

  public insertHook(pid: number, code: string) {
    this.hooker.insertHook(pid, code);
  }

  public removeHook(pid: number, hook: number) {
    this.hooker.removeHook(pid, hook);
  }
}

let instance = new Hooker();

export default instance;
