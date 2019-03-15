import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as request from 'request-promise-native'
import * as vm from 'vm'
const debug = require('debug')('yagt:api')

export default class ExternalApi implements Yagt.Translator {
  private config: Yagt.Config.OnlineApiItem
  private responseVmContext: vm.Context = vm.createContext({
    Request: request,
    text: '',
    result: '',
    md5: (data: string, encoding: crypto.HexBase64Latin1Encoding) => {
      const hash = crypto.createHash('md5')
      return hash.update(data).digest(encoding)
    }
  })
  private scriptString: string = ''

  constructor (config: Yagt.Config.OnlineApiItem) {
    this.config = config
    if (!this.config.jsFile) {
      debug(
        '[%s] config not contains enough information. ignore',
        this.config.name
      )
      throw new TypeError()
    }
    this.loadExternalJsFile()
  }

  public loadExternalJsFile () {
    if (!this.config.jsFile) return

    const absolutePath = path.join(global.__baseDir, this.config.jsFile)
    try {
      this.scriptString = fs.readFileSync(absolutePath, 'utf8')
      debug('external file %s loaded', absolutePath)
    } catch (e) {
      debug('external file %s loads failed !> %s', absolutePath, e)
    }
  }

  public async translate (text: string) {
    this.responseVmContext.text = text
    return new Promise<string>((resolve) => {
      vm.runInContext(this.scriptString, this.responseVmContext)
      resolve(this.responseVmContext.result)
    })
  }

  public isEnable () {
    return this.config.enable
  }

  public setEnable (isEnable: boolean) {
    this.config.enable = isEnable
  }

  public getName () {
    return this.config.name
  }
}
