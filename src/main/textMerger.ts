interface TextStore {
  [handle: number]: string[];
}

interface ThreadStore {
  [handle: number]: Yagt.TextOutputObject | undefined;
}

export default class TextMergerMiddleware
  implements Yagt.Middleware<Yagt.TextOutputObject> {
  static TIMEOUT = 500;

  private textStore: TextStore = {};
  private threadStore: ThreadStore = {};

  process(
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    if (!this.isStoreEmpty(context.handle)) {
      this.textStore[context.handle].push(context.text);
      return;
    }

    this.textStore[context.handle] = [];
    this.textStore[context.handle].push(context.text);
    this.threadStore[context.handle] = context;
    setTimeout(() => {
      context.text = this.textStore[context.handle]
        .join("")
        .replace(/[\r\n]/g, "");
      delete this.textStore[context.handle];
      this.threadStore[context.handle] = undefined;
      next(context);
    }, TextMergerMiddleware.TIMEOUT);
  }

  private isStoreEmpty(handle: number): boolean {
    return this.threadStore[handle] === undefined;
  }
}
