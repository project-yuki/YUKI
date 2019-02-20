export default class ApplicationBuilder<T> {
  private middlewares: Yagt.Middleware<T>[] = [];

  use(middleware: Yagt.Middleware<T>) {
    this.middlewares.push(middleware);
  }

  run(initContext: T) {
    this.iterator(initContext, 0);
  }

  private iterator(context: T, index: number) {
    if (index === this.middlewares.length) return;

    this.middlewares[index].process(context, newContext => {
      this.iterator(newContext, index + 1);
    });
  }
}
