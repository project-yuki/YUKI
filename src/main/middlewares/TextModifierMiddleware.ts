const debug = require('debug')('yuki:textInterceptor')

export default class TextInterceptorMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  private removeAscii: boolean
  private deduplicate: boolean
  private delineBreak: boolean

  constructor (config: yuki.Config.Texts['modifier']) {
    this.removeAscii = config.removeAscii
    this.deduplicate = config.deduplicate
    this.delineBreak = config.delineBreak
    debug('initialized')
  }

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    context.text = context.text.replace(/[\x00-\x20]/g, '')
    context.text = context.text.replace(/_t.*?\//g, '')

    if (this.removeAscii) {
      context.text = context.text.replace(/[\x00-\xFF]+/g, '')
      if (context.text === '') return
    }
    if (this.deduplicate) {
      context.text = context.text.replace(/([^]+?)\1+/g, '$1')
      if (context.text === '') return
    }
    if (this.delineBreak) {
      context.text = context.text.replace(/_r/g, '')
      context.text = context.text.replace(/<br>/g, '')
      context.text = context.text.replace(/#n/g, '')
      context.text = context.text.replace(/\s+/g, '')
      if (context.text === '') return
    }

    next(context)
  }
}
