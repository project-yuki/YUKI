import Api from "../../../../src/main/translate/api";

describe("Api", () => {
  it("get translation from form and parse with object", done => {
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

  it("get translation from form and parse with regex", done => {
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
});
