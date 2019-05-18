import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as request from 'request-promise-native'
import * as vm from 'vm'
const debug = require('debug')('yuki:api')

export default class ExternalApi implements yuki.Translator {
  private config: yuki.Config.OnlineApiItem
  private responseVmContext: vm.Context = vm.createContext({
    Request: request,
    text: '',
    md5: (data: string, encoding: crypto.HexBase64Latin1Encoding) => {
      const hash = crypto.createHash('md5')
      return hash.update(data).digest(encoding)
    },
    callback: undefined
  })
  private scriptString: string = ''

  constructor (config: yuki.Config.OnlineApiItem) {
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

  public translate (text: string, callback: (translation: string) => void) {
    this.responseVmContext.text = text
    this.responseVmContext.callback = callback
    vm.runInContext(this.scriptString, this.responseVmContext, {
      displayErrors: true
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
