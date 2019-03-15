const debug = require('debug')('yagt:filter')

export default class FilterMiddleware
  implements Yagt.Middleware<Yagt.TextOutputObject> {
  public process (
    context: Yagt.TextOutputObject,
    next: (newContext: Yagt.TextOutputObject) => void
  ) {
    debug('[%d] %s', context.handle, context.text)
    context.code = `/${context.code}`
    next(context)
  }
}
