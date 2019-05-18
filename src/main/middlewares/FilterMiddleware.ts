const debug = require('debug')('yuki:filter')

export default class FilterMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    debug('[%d] %s', context.handle, context.text)
    context.code = `/${context.code}`
    next(context)
  }
}
