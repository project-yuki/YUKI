import types from "../common/ipcTypes";
import logger from "../common/logger";
import TextInterceptor from "./textInterceptor";
import TextMerger from "./textMerger";
import { Textractor } from "textractor-wrapper";
import * as path from "path";

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
  ["thread-output"]: HookerPublisher;
}

export default class Hooker {
  private static instance: Hooker;
  static getInstance() {
    if (this.instance == null) {
      this.instance = new Hooker();
    }
    return this.instance;
  }

  private hooker: Textractor;

  private constructor() {
    logger.debug(
      `hooker: trying to resolve CLI exe at ${path.join(
        global.__baseDir,
        "lib/textractor/TextractorCLI.exe"
      )}`
    );
    this.hooker = new Textractor(
      path.join(global.__baseDir, "lib/textractor/TextractorCLI.exe")
    );
    this.initHookerCallbacks();
    this.hooker.start();
  }

  private initHookerCallbacks() {
    this.hooker.on("output", output => {
      TextMerger.getInstance().makeMerge(
        output.handle,
        output.text,
        mergedText => {
          if (!TextInterceptor.getInstance().textShouldBeIgnore(mergedText)) {
            logger.debug(`hooker [${output.handle}]: ${mergedText}`);
            delete output.text;
            output.code = `/${output.code}`;
            this.publisherMap["thread-output"].publish(output, mergedText);
          }
        }
      );
    });
  }

  private publisherMap: PublisherMap = {
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
    this.hooker.attach(pid);
  }

  public insertHook(pid: number, code: string) {
    this.hooker.hook(pid, code);
  }
}
