const debug = require('debug')('yuki:merger')

interface ITextStore {
  [handle: number]: string[]
}

interface IThreadStore {
  [handle: number]: yuki.TextOutputObject | undefined
}

export default class TextMergerMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  public static DEFAULT_TIMEOUT = 500

  private textStore: ITextStore = {}
  private threadStore: IThreadStore = {}
  private enable: boolean
  private timeout: number

  constructor (config: yuki.Config.Texts['merger']) {
    this.enable = config.enable
    this.timeout = config.timeout
      ? config.timeout
      : TextMergerMiddleware.DEFAULT_TIMEOUT
    debug('initialized', this.enable)
  }

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    if (!this.enable) {
      this.textStore[context.handle] = []
      this.textStore[context.handle].push(context.text)
      this.threadStore[context.handle] = context
      next(context)
      return
    }

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
    }, this.timeout)
  }

  private isStoreEmpty (handle: number): boolean {
    return this.threadStore[handle] === undefined
  }
}
