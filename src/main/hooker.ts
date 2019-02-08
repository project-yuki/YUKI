import types from "../common/ipcTypes";
const debug = require("debug");
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
      debug("yagt:hookerPublisher")(
        "webContents %s already subscribed type %s",
        webContents.getTitle(),
        this.type
      );
    } else {
      this.subscribers.push(webContents);
      debug("yagt:hookerPublisher")(
        "webContents %s successfully subscribed type %s",
        webContents.getTitle(),
        this.type
      );
    }
  }

  public unsubscribe(webContents: Electron.WebContents) {
    if (!this.subscribers.find(value => value === webContents)) {
      debug("yagt:hookerPublisher")(
        "webContents %s hasn't subscribed type %s",
        webContents.getTitle(),
        this.type
      );
    } else {
      this.subscribers = this.subscribers.filter(
        subscriber => subscriber !== webContents
      );
      debug("yagt:hookerPublisher")(
        "webContents %s successfully unsubscribed type %s",
        webContents.getTitle(),
        this.type
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
    let absolutePath = path.join(
      global.__baseDir,
      "lib/textractor/TextractorCLI.exe"
    );
    debug("trying to access CLI exe at %s", absolutePath);
    this.hooker = new Textractor(absolutePath);
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
            debug("yagt:hooker")("[%d] %s", output.handle, mergedText);
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
      debug("yagt:hooker")("trying to register unknown event %s", on);
    } else {
      this.publisherMap[on].subscribe(webContents);
    }
  }

  public unsubscribe(on: string, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      debug("yagt:hooker")("trying to unregister unknown event %s", on);
    } else {
      this.publisherMap[on].unsubscribe(webContents);
    }
  }

  public injectProcess(pid: number) {
    debug("injecting process %d...", pid);
    this.hooker.attach(pid);
    debug("process %d injected", pid);
  }

  public insertHook(pid: number, code: string) {
    debug("yagt:hooker")("inserting hook %s to process %d...", code, pid);
    this.hooker.hook(pid, code);
    debug("yagt:hooker")(`hook %s inserted into process %d`, code, pid);
  }
}
