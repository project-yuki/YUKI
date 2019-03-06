const debug = require("debug")("yagt:textInterceptor");

export default class TextInterceptorMiddleware
  implements Yagt.Middleware<Yagt.TextOutputObject> {
  constructor(config: Yagt.Config.Interceptor) {
    this.shouldBeIgnorePatterns = config.shouldBeIgnore;
    this.ignoreAsciiOnly = config.ignoreAsciiOnly;
    debug("initialized");
  }

  shouldBeIgnorePatterns: string[];
  ignoreAsciiOnly: boolean;

  static readonly MAX_LENGTH = 255;

  process(
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    if (this.textShouldBeIgnore(context.text)) return;
    if (this.ignoreAsciiOnly && this.isAsciiOnly(context.text)) return;

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

  private isAsciiOnly(text: string) {
    return /^[\x00-\xFF]*$/.test(text);
  }
}
