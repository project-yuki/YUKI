const ConfigInjector = require('inject-loader!../../../../src/main/config/Config')
import { expect } from 'chai'

describe('Config', () => {
  let fileWritten

  beforeEach(() => {
    fileWritten = false
  })

  const expected = {
    test: {
      id: 1,
      content: '『我跟喜欢成人游戏一样喜欢你』-「高坂桐乃」'
    }
  }

  const expectedModified = {
    test: {
      id: 1,
      content:
        '『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」'
    },
    added: true
  }

  it('loads if file exists', () => {
    const Config = makeLoadTestingConfig()
    Config.prototype.getFilename = () => 'valid/path/name'
    // tslint:disable-next-line: no-empty
    Config.prototype.getDefaultObject = () => {}

    const testConfig = new Config().init()

    // tslint:disable-next-line: no-console
    console.log(testConfig.get())
    expect(testConfig.get()).to.deep.equal(expected)
  })

  const makeLoadTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: () => true,
        watch: () => ''
      },
      jsonfile: {
        readFileSync: () => expected
      },
      path: {
        resolve: () => 'valid/path/name'
      }
    }).default

  it('saves default if file not exist', () => {
    const Config = makeSaveDefaultTestingConfig()
    Config.prototype.getFilename = () => 'invalid/path/name'
    Config.prototype.getDefaultObject = () => expected

    const testConfig = new Config().init()

    expect(fileWritten).to.equal(true)
    expect(testConfig.get()).to.deep.equal(expected)
  })

  const makeSaveDefaultTestingConfig = () =>
    ConfigInjector({
      jsonfile: {
        writeFileSync: () => {
          fileWritten = true
        }
      },
      fs: {
        watch: () => ''
      },
      path: {
        resolve: () => 'invalid/path/name'
      }
    }).default

  it('saves after calling save()', () => {
    const Config = makeSaveTestingConfig()
    Config.prototype.getFilename = () => 'valid/path/name'
    // tslint:disable-next-line: no-empty
    Config.prototype.getDefaultObject = () => {}

    const testConfig = new Config().init()

    testConfig.get().test.content =
      '『如果分手的恋人还能做朋友，要不从没爱过，要不还在爱着。』-「九ちのセカィ」'
    testConfig.get().added = true
    testConfig.save()

    expect(fileWritten).to.equal(true)
  })

  it('sets & saves after calling set()', () => {
    const Config = makeSaveTestingConfig()
    Config.prototype.getFilename = () => 'valid/path/name'
    // tslint:disable-next-line: no-empty
    Config.prototype.getDefaultObject = () => {}

    const testConfig = new Config().init()

    testConfig.set(expectedModified)
  })

  const makeSaveTestingConfig = () =>
    ConfigInjector({
      fs: {
        existsSync: () => true,
        watch: () => ''
      },
      jsonfile: {
        readFileSync: () => expected,
        writeFileSync: (filePath, obj) => {
          fileWritten = true
          expect(obj).to.deep.equal(expectedModified)
        }
      },
      path: {
        resolve: () => 'valid/path/name'
      }
    }).default
})
