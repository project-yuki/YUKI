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
    }

    export interface Default {
      localeChangers: LocaleChangerItem[];
    }
  }
}
