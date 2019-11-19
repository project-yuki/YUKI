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
    content?: LingoesPattern
  }

  export interface DictOptions {
    dict: string
    word: string
  }

  export interface LingoesPattern {
    kana?: Array<String>
    definitions?: Array<{
      partOfSpeech: string,
      explanations: Array<{
        content: string,
        example: {
          sentence: string,
          content: string
        }
      }>
    }>
  }
}
