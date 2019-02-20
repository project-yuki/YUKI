declare namespace Yagt {
  export interface Middleware {
    process: (context: any, next: (newContext: any) => void) => void;
  }
}
