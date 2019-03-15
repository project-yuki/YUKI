declare namespace Yagt {
  export interface Middleware<T> {
    process: (context: T, next: (newContext: T) => void) => void
  }

  export type MeCabPatterns = Array<{
    word: string;
    abbr: string;
    kana: string;
  }>
}
