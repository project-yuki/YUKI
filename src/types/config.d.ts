declare namespace Yagt {
  namespace Config {
    interface LocaleChangerItems {
      [id: string]: LocaleChangerItem;
    }

    interface LocaleChangerItem {
      name: string;
      enable: boolean;
      exec: string;
    }

    interface OnlineApiItem {
      name: string;
      enable: boolean;
      url: string;
      method: string;
      needSession: boolean;
      requestBodyFormat: string;
      responseBodyPattern: string;
      external: boolean;
      jsFile: string;
    }

    export interface JBeijing {
      enable: boolean;
      path: string;
      dictPath?: string;
      traditionalChinese?: boolean;
    }

    export interface MeCab {
      enable: boolean;
      path: string;
    }

    export interface Default {
      localeChangers: LocaleChangerItems;
      onlineApis: OnlineApiItem[];
      translators: {
        jBeijing: JBeijing;
      };
    }
  }
}
