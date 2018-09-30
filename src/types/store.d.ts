declare namespace Yagt {
  export interface HooksState {
    hookInfos: TextThread[];
    texts: {
      [num: number]: string[];
    };
    currentDisplayHookIndex: number;
  }

  export interface Game {
    name: string;
    path: string;
    code: string;
  }
  export interface ConfigState {
    default: any;
    games: Game[];
  }

  export interface TranslatorHookState extends HooksState {
    translationsForCurrentIndex: Translations;
  }
}
