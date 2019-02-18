declare namespace Yagt {
  export interface SettingsState {
    localeChangers: TempLocaleChangerItem[];
  }

  type TempLocaleChangerItem = Yagt.Config.LocaleChangerItem & { id: string };

  export interface TextOutputObject {
    handle: number;
    pid: number;
    addr: number;
    ctx: number;
    ctx2: number;
    name: string;
    code: string;
  }
  export interface HooksState {
    hookInfos: TextOutputObject[];
    texts: {
      [num: string]: string[];
    };
    currentDisplayHookIndex: number;
  }

  export interface Game {
    name: string;
    path: string;
    code: string;
    localeChanger: string;
  }
  export interface ConfigState {
    default: any;
    games: Game[];
  }

  export interface GuiState {
    noGame: boolean;
  }

  export interface TranslatorHookState extends HooksState {
    translationsForCurrentIndex: Translations;
    toDisplayHookCode: string;
  }

  export interface TranslatorConfigState {
    default: any;
    game: Game;
    gui: {
      originalText: FontStyle;
      translationText: FontStyle;
    };
  }

  export interface FontStyle {
    fontSize: number;
    color: string;
  }

  export interface TranslatorViewState {
    isButtonsShown: boolean;
  }
}
