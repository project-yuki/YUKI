import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as request from 'request-promise-native'
import * as vm from 'vm'
const debug = require('debug')('yuki:api')

export default class ExternalApi implements yuki.Translator {
  private config: yuki.Config.OnlineApiItem
  private responseVmContext!: vm.Context
  private scriptString: string = ''
  private absolutePath: string = ''

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
    this.createVmContext()
    this.registerWatchCallback()
  }

  public translate (text: string, callback: (translation: string) => void) {
    this.responseVmContext.text = text
    this.responseVmContext.callback = callback
    try {
      vm.runInContext(this.scriptString, this.responseVmContext, {
        displayErrors: true
      })
    } catch (e) {
      debug('[%s] runtime error !> %s', this.config.name, e.stack)
    }
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

  private loadExternalJsFile () {
    if (!this.config.jsFile) return

    this.absolutePath = path.join(global.__baseDir, this.config.jsFile)
    try {
      this.scriptString = fs.readFileSync(this.absolutePath, 'utf8')
      debug('external file %s loaded', this.absolutePath)
    } catch (e) {
      debug('external file %s loads failed !> %s', this.absolutePath, e)
    }
  }

  private createVmContext () {
    this.responseVmContext = vm.createContext({
      Buffer,
      Request: request,
      text: '',
      md5: (data: string, encoding: crypto.HexBase64Latin1Encoding) => {
        const hash = crypto.createHash('md5')
        return hash.update(data).digest(encoding)
      },
      crypto: {
        createHash: crypto.createHash,
        createHmac: crypto.createHmac
      },
      callback: undefined
    })
  }

  private registerWatchCallback () {
    fs.watch(this.absolutePath, {}, () => {
      debug('[%s] script file changed. reloading...', this.config.name)
      this.loadExternalJsFile()
      this.createVmContext()
    })
  }
}
