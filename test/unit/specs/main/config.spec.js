const ConfigInjector = require("inject-loader!../../../../src/main/config/config");

describe("Config", () => {
  let fileWritten;
  let folderCreated;

  beforeEach(() => {
    fileWritten = false;
    folderCreated = false;
  });

  const expected = {
    test: {
      id: 1,
      content: "『我跟喜欢成人游戏一样喜欢你』-「高坂桐乃」"
    }
  };

  const expectedModified = {
    test: {
      id: 1,
      content:
        "『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」"
    },
    added: true
  };

  it("loads if file exists", () => {
    const Config = makeLoadTestingConfig();

    const testConfig = new Config("valid/config/path");

    expect(testConfig.get()).to.deep.equal(expected);
  });

  const makeLoadTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: () => true,
        readFileSync: () => {}
      },
      "js-yaml": {
        safeLoad: () => expected
      },
      "../../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  it("saves default if file not exist and there is ./config folder", () => {
    const Config = makeSaveDefaultTestingConfig();

    const testConfig = new Config("invalid/config/path", expected);

    expect(fileWritten).to.equal(true);
    expect(testConfig.get()).to.deep.equal(expected);
  });

  const makeSaveDefaultTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: path => {
          if (path === "config") return true;
          else return false;
        },
        writeFileSync: () => {
          fileWritten = true;
        }
      },
      "js-yaml": {
        safeDump: () => {}
      },
      "../../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  it("creates folder and save default if file not exist and there isn't ./config folder", () => {
    const Config = makeCreateFolderTestingConfig();

    const testConfig = new Config("invalid/config/path", expected);

    expect(folderCreated).to.equal(true);
    expect(fileWritten).to.equal(true);
    expect(testConfig.get()).to.deep.equal(expected);
  });

  const makeCreateFolderTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: () => false,
        mkdirSync: dirname => {
          if (dirname === "config") folderCreated = true;
        },
        writeFileSync: () => {
          fileWritten = true;
        }
      },
      "js-yaml": {
        safeDump: obj => {
          expect(obj).to.deep.equal(expected);
        }
      },
      "../../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;

  it("saves after calling save()", () => {
    const Config = makeSaveTestingConfig();

    const testConfig = new Config("valid/config/path", expected);

    testConfig.get().test.content =
      "『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」";
    testConfig.get().added = true;
    testConfig.save();

    expect(fileWritten).to.equal(true);
  });

  it("sets & saves after calling set()", () => {
    const Config = makeSaveTestingConfig();

    const testConfig = new Config("valid/config/path", expected);

    testConfig.set(expectedModified);

    expect(fileWritten).to.equal(true);
  });

  const makeSaveTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: () => true,
        writeFileSync: () => {
          fileWritten = true;
        },
        readFileSync: () => {}
      },
      "js-yaml": {
        safeLoad: () => expected,
        safeDump: obj => {
          expect(obj).to.deep.equal(expectedModified);
        }
      },
      "../../common/logger": {
        debug: () => {},
        error: () => {}
      }
    }).default;
});
