export = vuetify;
declare class vuetify {
  static install(Vue: any, args: any): void;
  static installed: boolean;
  static version: string;
  constructor(preset: any);
  framework: any;
  installed: any;
  preset: any;
  init(root: any, ssrContext: any): void;
  use(Service: any): void;
}
