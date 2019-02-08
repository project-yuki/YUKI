const ExternalApiInjector = require("inject-loader!../../../../src/main/translate/externalApi");

describe("ExternalApi", () => {
  before(() => {
    (<any>global).__baseDir = __dirname;
  });

  it("gets translation from external JS file", () => {
    const ExternalApi = makeDummyLoggerExternalApi();
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

  const makeDummyLoggerExternalApi = () =>
    ExternalApiInjector({
      "../../common/logger": {
        debug: msg => {
          console.log(msg);
        },
        error: msg => {
          console.error(msg);
        }
      }
    }).default;
});
