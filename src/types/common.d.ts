declare namespace yuki {
  export interface Middleware<T> {
    process: (context: T, next: (newContext: T) => void) => void
  }

  export type MeCabPattern = {
    word: string;
    abbr: string;
    kana: string;
  }

  export type MeCabPatterns = Array<MeCabPattern>

  export interface DictResult {
    found?: boolean
    word?: string
    content?: string
  }

  export interface DictOptions {
    dict: string
    word: string
  }
}
