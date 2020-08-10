declare namespace yuki {
  namespace Config {
    export interface Config {}

    export interface LocaleChangerItems {
      [id: string]: LocaleChangerItem
    }

    export interface LocaleChangerItem {
      name: string
      enable: boolean
      exec: string
    }

    export interface OnlineApiItem {
      name: string
      enable: boolean
      url?: string
      method?: string
      needSession?: boolean
      requestBodyFormat?: string
      requestHeaders?: string
      responseBodyPattern?: string
      external?: boolean
      jsFile?: string
    }

    export interface JBeijing {
      enable: boolean
      path: string
      dictPath?: string
      traditionalChinese?: boolean
    }

    export interface LibraryItem {
      enable: boolean
      path: string
    }

    export interface Default extends Libraries, Config {
      language: string
      localeChangers: LocaleChangerItems
      onlineApis: OnlineApiItem[]
      dictionaries: Dictionaries
    }

    export interface Libraries {
      librariesRepoUrl: string
      mecab: LibraryItem
      translators: {
        jBeijing: JBeijing
      }
    }

    export interface Dictionaries {
      lingoes: LibraryItem
    }

    export interface Texts extends Config {
      interceptor: {
        shouldBeIgnore: string[];
        ignoreAsciiOnly: boolean;
        maxLength: number;
      }
      modifier: {
        removeAscii: boolean;
        deduplicate: boolean;
        deduplicateCount: number;
        delineBreak: boolean;
      }
      merger: {
        enable: boolean;
        timeout: number;
      }
    }

    export interface Gui extends Config {
      mainWindow: {
        bounds: Electron.Rectangle;
      }
      translatorWindow: {
        bounds: Electron.Rectangle;
        alwaysOnTop: boolean;
        originalText: FontStyle;
        translationText: TranslationTextStyle;
        background: string;
        renderMode: 'transparent' | 'translucent';
        mecab: {
          showRomaji: boolean;
        }
        autoHideTitlebar: boolean;
      }
    }

    export interface Games extends Array<Game>, Config {}
  }
}
