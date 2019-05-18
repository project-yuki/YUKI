interface ITextStore {
  [handle: number]: string[]
}

interface IThreadStore {
  [handle: number]: yuki.TextOutputObject | undefined
}

export default class TextMergerMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  public static TIMEOUT = 500

  private textStore: ITextStore = {}
  private threadStore: IThreadStore = {}

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    if (!this.isStoreEmpty(context.handle)) {
      this.textStore[context.handle].push(context.text)
      return
    }

    this.textStore[context.handle] = []
    this.textStore[context.handle].push(context.text)
    this.threadStore[context.handle] = context
    setTimeout(() => {
      context.text = this.textStore[context.handle]
        .join('')
        .replace(/[\r\n]/g, '')
      delete this.textStore[context.handle]
      this.threadStore[context.handle] = undefined
      next(context)
    }, TextMergerMiddleware.TIMEOUT)
  }

  private isStoreEmpty (handle: number): boolean {
    return this.threadStore[handle] === undefined
  }
}
