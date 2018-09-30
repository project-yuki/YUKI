declare namespace Yagt {
  export interface Translations {
    original: string;
    translations: {
      [apiName: string]: string;
    };
  }

  export interface Api {
    translate(text: string, callback: (translation: string) => void): void;
    isEnabled(): boolean;
    setEnabled(isEnabled: boolean): void;
    getName(): string;
  }
}
