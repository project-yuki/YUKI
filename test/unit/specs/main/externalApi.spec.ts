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

  it("keeps session when request multiple times", () => {
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
      })
      .then(() =>
        youdao.translate(
          "はいっ、今日は柚子の入浴剤が入ってました。お湯も少し白くて温泉みたいでしたよ？"
        )
      )
      .then(translation => {
        expect(translation).to.equal(
          "进去了，今天泡柚子的澡剂。水也有点白的像温泉一样呢。？"
        );
      });
  }).timeout(5000);
});
