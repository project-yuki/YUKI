export default class ApplicationBuilder<T> {
  private middlewares: Array<yuki.Middleware<T>> = []

  public use (middleware: yuki.Middleware<T>) {
    this.middlewares.push(middleware)
  }

  public run (initContext: T) {
    this.iterator(initContext, 0)
  }

  private iterator (context: T, index: number) {
    if (index === this.middlewares.length) return

    this.middlewares[index].process(context, (newContext) => {
      this.iterator(newContext, index + 1)
    })
  }
}
