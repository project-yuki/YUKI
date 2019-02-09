declare namespace NodeJS {
  interface Global {
    __static: string;
    __baseDir: string;
    __appDir: string;
    tempTranslationPattern: {
      [name: string]: any;
    };
  }
}
