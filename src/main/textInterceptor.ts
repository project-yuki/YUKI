export default class TextInterceptor {
  static instance: TextInterceptor = new TextInterceptor();
  static getInstance() {
    return this.instance;
  }

  senselessTextPatterns: string[] = ["windowbtn", "00_プロローグ１", "value"];
  static readonly MAX_LENGTH = 255;

  isSenseless(text: string): boolean {
    return this.isTooLong(text) || this.containsSenselessText(text);
  }

  private containsSenselessText(text: string) {
    for (let pattern of this.senselessTextPatterns) {
      if (text.indexOf(pattern) > -1) {
        return true;
      }
    }
    return false;
  }

  private isTooLong(text: string) {
    return text.length > TextInterceptor.MAX_LENGTH;
  }
}
