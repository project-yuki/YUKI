/// <reference path="../../../../src/types/common.d.ts" />

import ApplicationBuilder from "../../../../src/common/applicationBuilder";
import { expect } from "chai";

class SubstringMiddleware implements Yagt.Middleware<string> {
  process(context: string, next: (newContext: string) => void) {
    if (context.length < 1) next(context);
    else next(context.substring(0, context.length - 1));
  }
}

class ExpectMiddleware implements Yagt.Middleware<string> {
  private expectValue: string;
  private done: () => void;

  constructor(expectValue: string, done: () => void) {
    this.expectValue = expectValue;
    this.done = done;
  }

  process(context: string, next: (newContext: string) => void) {
    expect(context).to.deep.equal(this.expectValue);
    this.done();
  }
}

describe("ApplicationBuilder", () => {
  it("runs one middleware correctly", done => {
    const applicationBuilder = new ApplicationBuilder();

    applicationBuilder.use(new SubstringMiddleware());
    applicationBuilder.use(
      new ExpectMiddleware("ボクに選択の余地は無かった", done)
    );
    applicationBuilder.run("ボクに選択の余地は無かった。");
  });

  it("runs multiple middlewares correctly", done => {
    const applicationBuilder = new ApplicationBuilder();

    applicationBuilder.use(new SubstringMiddleware());
    applicationBuilder.use(new SubstringMiddleware());
    applicationBuilder.use(new SubstringMiddleware());
    applicationBuilder.use(new ExpectMiddleware("A", done));
    applicationBuilder.run("ABCD");
  });
});
