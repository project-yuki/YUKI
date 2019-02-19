declare namespace Yagt {
  export interface Translations {
    original: string;
    translations: {
      [apiName: string]: string;
    };
  }

  export interface Translator {
    translate(text: string): Promise<string>;
    isEnable(): boolean;
    setEnable(isEnable: boolean): void;
    getName(): string;
  }

  export interface MeCabPattern {
    [index: number]: {
      word: string;
      type: string;
      abbr: string;
    };
  }
}
