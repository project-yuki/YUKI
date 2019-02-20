import configManager from "./config";
const debug = require("debug")("yagt:textInterceptor");

export default class TextInterceptorMiddleware
  implements Yagt.Middleware<Yagt.TextOutputObject> {
  constructor() {
    this.shouldBeIgnorePatterns = configManager
      .getInstance()
      .get("interceptor").shouldBeIgnore;
    debug("initialized");
  }

  shouldBeIgnorePatterns!: string[];

  static readonly MAX_LENGTH = 255;

  process(
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    if (this.textShouldBeIgnore(context.text)) return;

    next(context);
  }

  textShouldBeIgnore(text: string): boolean {
    return this.isTooLong(text) || this.containsShouldBeIgnorePattern(text);
  }

  private isTooLong(text: string) {
    return text.length > TextInterceptorMiddleware.MAX_LENGTH;
  }

  private containsShouldBeIgnorePattern(text: string) {
    for (let pattern of this.shouldBeIgnorePatterns) {
      if (text.indexOf(pattern) > -1) {
        return true;
      }
    }
    return false;
  }
}
