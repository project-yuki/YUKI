interface TempStore {
  [num: number]: string[];
}

export default class TextMerger {
  static instance: TextMerger = new TextMerger();
  static getInstance() {
    return this.instance;
  }

  static TIMEOUT = 1000;

  private tempStore: TempStore = {};

  makeMerge(
    hookNum: number,
    text: string,
    callback: (mergedText: string) => void
  ) {
    if (this.isStoreEmpty(hookNum)) {
      this.tempStore[hookNum] = [text];
      setTimeout(() => {
        let mergedText = this.tempStore[hookNum]
          .join("")
          .replace(/[\r\n]/g, "");
        delete this.tempStore[hookNum];
        callback(mergedText);
      }, TextMerger.TIMEOUT);
    } else {
      this.tempStore[hookNum].push(text);
    }
  }

  private isStoreEmpty(hookNum: number): boolean {
    return this.tempStore[hookNum] === undefined;
  }
}
