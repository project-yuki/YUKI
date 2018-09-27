declare namespace Yagt {
  namespace Config {
    interface LocaleChangerItem {
      name: string;
      enabled: boolean;
      exec: string;
    }

    interface OnlineApiItem {
      name: string;
      enabled: boolean;
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
