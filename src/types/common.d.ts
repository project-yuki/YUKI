declare namespace yuki {
  export interface Middleware<T> {
    process: (context: T, next: (newContext: T) => void) => void
  }

  export type MeCabPatterns = Array<{
    word: string;
    abbr: string;
    kana: string;
  }>

  export interface DictResult {
    found: boolean
    word?: string
    content?: string
  }

  export interface DictOptions {
    dict: string
    word: string
  }
}
