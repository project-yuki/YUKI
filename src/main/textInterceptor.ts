import configManager from "./config";
import logger from "../common/logger";

export default class TextInterceptor {
  static instance: TextInterceptor = new TextInterceptor();
  static getInstance() {
    return this.instance;
  }

  initialize() {
    this.shouldBeIgnorePatterns = configManager
      .getInstance()
      .get("interceptor").shouldBeIgnore;
    logger.debug("text interceptor: initialized");
  }

  shouldBeIgnorePatterns!: string[];

  static readonly MAX_LENGTH = 255;

  textShouldBeIgnore(text: string): boolean {
    return this.isTooLong(text) || this.containsShouldBeIgnorePattern(text);
  }

  private isTooLong(text: string) {
    return text.length > TextInterceptor.MAX_LENGTH;
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
