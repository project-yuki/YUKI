import IpcTypes from "../common/ipcTypes";
const debug = require("debug");
import TextMergerMiddleware from "./textMerger";
import { Textractor } from "textractor-wrapper";
import * as path from "path";
import ApplicationBuilder from "../common/applicationBuilder";
import TextInterceptorMiddleware from "./textInterceptor";
import MecabMiddleware from "./mecab";
import ConfigManager from "./config";

const applicationBuilder = new ApplicationBuilder<Yagt.TextOutputObject>();

class PublishMiddleware implements Yagt.Middleware<Yagt.TextOutputObject> {
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

  process(context: Yagt.TextOutputObject) {
    for (let subscriber of this.subscribers) {
      subscriber.send(this.type, context);
    }
  }
}

interface PublisherMap {
  ["thread-output"]: PublishMiddleware;
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
    this.buildApplication();
    this.initHookerCallbacks();
    this.hooker.start();
  }

  private buildApplication() {
    applicationBuilder.use(new TextMergerMiddleware());
    applicationBuilder.use(
      new TextInterceptorMiddleware(
        ConfigManager.getInstance().get<Yagt.Config.Interceptor>("interceptor")
      )
    );
    applicationBuilder.use(
      new MecabMiddleware(
        ConfigManager.getInstance().get<Yagt.Config.Default>("default").mecab
      )
    );
    applicationBuilder.use(new FilterMiddleware());
    applicationBuilder.use(this.publisherMap["thread-output"]);
  }

  private initHookerCallbacks() {
    this.hooker.on("output", output => {
      applicationBuilder.run(output);
    });
  }

  private publisherMap: PublisherMap = {
    "thread-output": new PublishMiddleware(IpcTypes.HAS_HOOK_TEXT)
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

class FilterMiddleware implements Yagt.Middleware<Yagt.TextOutputObject> {
  process(
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    debug("yagt:hooker")("[%d] %s", context.handle, context.text);
    context.code = `/${context.code}`;
    next(context);
  }
}
