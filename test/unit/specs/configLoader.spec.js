import Config from "../../../src/common/config";

describe("ConfigLoader", () => {
  it("loads correct contents from yaml file", () => {
    let config = new Config("test/resource/config.test.yml");
    expect(config.get().test.id).to.equal(1);
    expect(config.get().test.content).to.equal(
      "『我跟喜欢成人游戏一样喜欢你』-「高坂桐乃」"
    );
  }),
    it("modifies and saves correct content", () => {
      let config = new Config("test/resource/config.test.yml");

      config.get().test.content =
        "『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」";
      config.get().added = true;
      config.save();

      config = new Config("test/resource/config.test.yml");
      expect(config.get().test.id).to.equal(1);
      expect(config.get().test.content).to.equal(
        "『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」"
      );

      config.get().test.content = "『我跟喜欢成人游戏一样喜欢你』-「高坂桐乃」";
      delete config.get().added;
      config.save();
    });
});
