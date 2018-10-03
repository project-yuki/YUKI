import Api from "../../../../src/main/translate/api";
import TranslationManager from "../../../../src/main/translate/translationManager";

describe("Api", () => {
  it("gets translation from form and parses with object", done => {
    let baidu = new Api({
      name: "baidu",
      url: "https://fanyi.baidu.com/transapi",
      method: "POST",
      requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
      responseBodyPattern: "J%RESPONSE%.data[0].dst"
    });

    baidu.translate(
      "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
      translation => {
        expect(translation).to.equal("如果攻略悠真的话是210日元。原来如此啊…");
        done();
      }
    );
  });

  it("gets translation from form and parses with regex", done => {
    let googleCN = new Api({
      name: "googleCN",
      url: "https://translate.google.cn/m",
      method: "POST",
      requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
      responseBodyPattern: 'Rclass="t0">([^<]*)<'
    });

    googleCN.translate(
      "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
      translation => {
        expect(translation).to.equal(
          "如果你捕获Yuen-kun，它是210日元。我明白了......"
        );
        done();
      }
    );
  });

  it("combines multiple translations into Yagt.Translations object", done => {
    let apis = [
      {
        name: "baidu",
        url: "https://fanyi.baidu.com/transapi",
        method: "POST",
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: "J%RESPONSE%.data[0].dst",
        enable: true
      },
      {
        name: "googleCN",
        url: "https://translate.google.cn/m",
        method: "POST",
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: true
      }
    ];

    TranslationManager.getInstance()
      .initialize(apis)
      .translate(
        "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
        translations => {
          expect(translations).to.deep.equal({
            original: "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
            translations: {
              baidu: "如果攻略悠真的话是210日元。原来如此啊…",
              googleCN: "如果你捕获Yuen-kun，它是210日元。我明白了......"
            }
          });
          done();
        }
      );
  });

  it("returns no translation if there is no enabled api", done => {
    let apis = [
      {
        name: "baidu",
        url: "https://fanyi.baidu.com/transapi",
        method: "POST",
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: "J%RESPONSE%.data[0].dst",
        enable: false
      },
      {
        name: "googleCN",
        url: "https://translate.google.cn/m",
        method: "POST",
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: false
      }
    ];

    TranslationManager.getInstance()
      .initialize(apis)
      .translate(
        "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
        translations => {
          expect(translations).to.deep.equal({
            original: "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
            translations: {}
          });
          done();
        }
      );
  });

  it("returns translations for any enabled apis", done => {
    let apis = [
      {
        name: "baidu",
        url: "https://fanyi.baidu.com/transapi",
        method: "POST",
        requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
        responseBodyPattern: "J%RESPONSE%.data[0].dst",
        enable: true
      },
      {
        name: "googleCN",
        url: "https://translate.google.cn/m",
        method: "POST",
        requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
        responseBodyPattern: 'Rclass="t0">([^<]*)<',
        enable: false
      }
    ];

    TranslationManager.getInstance()
      .initialize(apis)
      .translate(
        "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
        translations => {
          expect(translations).to.deep.equal({
            original: "悠真くんを攻略すれば２１０円か。なるほどなぁ…",
            translations: {
              baidu: "如果攻略悠真的话是210日元。原来如此啊…"
            }
          });
          done();
        }
      );
  });
});
