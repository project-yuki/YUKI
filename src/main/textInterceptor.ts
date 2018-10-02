export default class TextInterceptor {
  static instance: TextInterceptor = new TextInterceptor();
  static getInstance() {
    return this.instance;
  }

  shouldBeIgnorePatterns: string[] = ["value", "sys", "\u00020"];

  shouldBeRemovePatterns: string[] = ["windowbtn", "00_プロローグ１", "menu"];

  static readonly MAX_LENGTH = 255;

  hookShouldBeRemove(text: string): boolean {
    return this.containsShouldBeRemovePattern(text);
  }

  containsShouldBeRemovePattern(text: string) {
    for (let pattern of this.shouldBeRemovePatterns) {
      if (text.indexOf(pattern) > -1) {
        return true;
      }
    }
    return false;
  }

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
