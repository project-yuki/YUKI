export default class ApplicationBuilder {
  private middlewares: Yagt.Middleware[] = [];

  use(middleware: Yagt.Middleware) {
    this.middlewares.push(middleware);
  }

  run(initContext: any) {
    this.iterator(initContext, 0);
  }

  private iterator(context: any, index: number) {
    if (index === this.middlewares.length) return;

    this.middlewares[index].process(context, newContext => {
      this.iterator(newContext, index + 1);
    });
  }
}
