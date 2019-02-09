import ExternalApi from "../../../../src/main/translate/externalApi";
import { expect } from "chai";

describe("ExternalApi", () => {
  before(() => {
    (<any>global).__baseDir = __dirname;
  });

  it("gets translation from external JS file", () => {
    let youdao = new ExternalApi({
      enable: true,
      external: true,
      jsFile: "..\\..\\temp\\youdaoApi.js",
      name: "youdao"
    });

    return youdao
      .translate("悠真くんを攻略すれば２１０円か。なるほどなぁ…")
      .then(translation => {
        expect(translation).to.equal(
          "如果攻略悠真的话就是210日元啊。原来如此啊……"
        );
      });
  }).timeout(5000);
});
