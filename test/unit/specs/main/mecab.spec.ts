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
      { word: "ボク", abbr: "n", kana: "ぼく" },
      { word: "に", abbr: "p", kana: "" },
      { word: "選択", abbr: "n", kana: "せんたく" },
      { word: "の", abbr: "p", kana: "" },
      { word: "余地", abbr: "n", kana: "よち" },
      { word: "は", abbr: "p", kana: "" },
      { word: "無かっ", abbr: "adj", kana: "なかっ" },
      { word: "た", abbr: "aux", kana: "" },
      { word: "。", abbr: "w", kana: "" }
    ]);
  });
});
