export default class TextInterceptor {
  static instance: TextInterceptor = new TextInterceptor();
  static getInstance() {
    return this.instance;
  }

  senselessTextPatterns: string[] = ["windowbtn", "00_プロローグ１", "value"];

  isSenseless(text: string): boolean {
    for (let pattern of this.senselessTextPatterns) {
      if (text.indexOf(pattern) > -1) {
        return true;
      }
    }
    return false;
  }
}
