declare namespace Yagt {
  namespace Config {
    interface LocaleChangerItem {
      name: string;
      enabled: boolean;
      exec: string;
    }

    interface OnlineApiItem {}

    export interface Default {
      localeChangers: LocaleChangerItem[];
    }
  }
}
