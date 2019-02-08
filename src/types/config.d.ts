declare namespace Yagt {
  namespace Config {
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

    interface JBeijing {
      enable: boolean;
      path: string;
      dictPath?: string;
      traditionalChinese?: boolean;
    }

    export interface Default {
      localeChangers: LocaleChangerItem[];
      onlineApis: OnlineApiItem[];
      translators: {
        jBeijing: JBeijing;
      };
    }
  }
}
