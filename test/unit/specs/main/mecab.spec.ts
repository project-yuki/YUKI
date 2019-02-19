import MeCabManager from "../../../../src/main/mecab";
import { expect } from "chai";
import * as path from "path";

describe("MeCab", () => {
  before(() => {
    MeCabManager.getInstance().load({
      enable: true,
      path: path.resolve(__dirname, "../../../../../libraries/pos/mecab-ipadic")
    });
  });

  it("returns correct patterns", () => {
    const patterns = MeCabManager.getInstance().parseSync(
      "ボクに選択の余地は無かった。"
    );

    expect(patterns).to.deep.equal([
      { word: "ボク", type: "名詞", abbr: "n" },
      { word: "に", type: "助詞", abbr: "p" },
      { word: "選択", type: "名詞", abbr: "n" },
      { word: "の", type: "助詞", abbr: "p" },
      { word: "余地", type: "名詞", abbr: "n" },
      { word: "は", type: "助詞", abbr: "p" },
      { word: "無かっ", type: "形容詞", abbr: "adj" },
      { word: "た", type: "助動詞", abbr: "aux" },
      { word: "。", type: "記号", abbr: "w" }
    ]);
  });
});
