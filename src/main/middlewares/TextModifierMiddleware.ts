const debug = require('debug')('yuki:textInterceptor')

export default class TextInterceptorMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  private removeAscii: boolean

  constructor (config: yuki.Config.Texts['modifier']) {
    this.removeAscii = config.removeAscii
    debug('initialized')
  }

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    if (this.removeAscii) {
      context.text = context.text.replace(/[\x00-\xFF]+/g, '')
    }

    next(context)
  }
}
