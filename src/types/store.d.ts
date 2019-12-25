declare namespace yuki {
  export interface SettingsState {
    localeChangers: TempLocaleChangerItem[]
  }

  type TempLocaleChangerItem = yuki.Config.LocaleChangerItem & { id: string }

  export interface TextOutputObject extends TextThread {
    text: string
  }

  export interface TextThread {
    handle: number
    pid: number
    addr: number
    ctx: number
    ctx2: number
    name: string
    code: string
  }

  export interface TranslationMessage {
    id: number
    translation: Translations['translations']
  }

  export interface Game {
    name: string
    path: string
    code: string
    localeChanger: string
  }
  export interface ConfigState {
    default: yuki.Config.Default
    games: Game[]
    librariesBaseStorePath: string
  }

  export interface GuiState {
    noGame: boolean
    debugMessages: string[],
    isGameStartingEnded: boolean,
    processes: Processes
  }

  export interface TranslatorHookState {
    isMecabEnable: boolean
    hookInfos: TextThread[]
    texts: {
      [handle: string]: string[];
    }
    patterns: {
      [handle: string]: yuki.MeCabPatterns[];
    }
    currentDisplayHookIndex: number
    translations: {
      [handle: string]: Array<Translations['translations']>;
    }
    toDisplayHookCode: string
  }

  export interface TranslatorConfigState {
    default: yuki.Config.Default
    game: Game
    gui: {
      originalText: FontStyle;
      translationText: TranslationTextStyle;
      background: string;
      mecab: {
        showRomaji: boolean;
      }
      autoHideTitlebar: boolean;
    }
  }

  export interface FontStyle {
    fontSize: number
    color: string
  }

  export interface TranslationTextStyle extends FontStyle {
    margin: number
  }

  export interface TranslatorViewState {
    isButtonsShown: boolean
    isWindowTooHigh: boolean
    pauseNewText: boolean
    dict: DictResult
    isGetDictResult: boolean
  }
}
