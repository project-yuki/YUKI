import IpcTypes from '../common/IpcTypes'
const debug = require('debug')('yuki:hooker')
import * as path from 'path'
import { Textractor } from 'textractor-wrapper'
import ApplicationBuilder from '../common/ApplicationBuilder'
import ConfigManager from './config/ConfigManager'
import FilterMiddleware from './middlewares/FilterMiddleware'
import MecabMiddleware from './middlewares/MeCabMiddleware'
import PublishMiddleware from './middlewares/PublishMiddleware'
import TextInterceptorMiddleware from './middlewares/TextInterceptorMiddleware'
import TextMergerMiddleware from './middlewares/TextMergerMiddleware'
import TextModifierMiddleware from './middlewares/TextModifierMiddleware'

let applicationBuilder: ApplicationBuilder<yuki.TextOutputObject>

interface IPublisherMap {
  ['thread-output']: PublishMiddleware
}

export default class Hooker {
  public static getInstance () {
    if (!this.instance) {
      this.instance = new Hooker()
    }
    return this.instance
  }
  private static instance: Hooker | undefined

  private hooker: Textractor

  private publisherMap: IPublisherMap = {
    'thread-output': new PublishMiddleware(IpcTypes.HAS_HOOK_TEXT)
  }

  private constructor () {
    const absolutePath = path.join(
      global.__baseDir,
      'lib/textractor/TextractorCLI.exe'
    )
    debug('trying to access CLI exe at %s', absolutePath)
    this.hooker = new Textractor(absolutePath)
    this.buildApplication()
    this.initHookerCallbacks()
    this.hooker.start()
  }

  public rebuild () {
    delete require.cache[require.resolve('mecab-ffi')]
    this.buildApplication()
  }

  public subscribe (on: keyof IPublisherMap, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      debug('trying to register unknown event %s', on)
    } else {
      this.publisherMap[on].subscribe(webContents)
    }
  }

  public unsubscribe (on: string, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      debug('trying to unregister unknown event %s', on)
    } else {
      this.publisherMap[on].unsubscribe(webContents)
    }
  }

  public injectProcess (pid: number) {
    debug('injecting process %d...', pid)
    this.hooker.attach(pid)
    debug('process %d injected', pid)
  }

  public insertHook (pid: number, code: string) {
    debug('inserting hook %s to process %d...', code, pid)
    this.hooker.hook(pid, code)
    debug(`hook %s inserted into process %d`, code, pid)
  }

  private buildApplication () {
    applicationBuilder = new ApplicationBuilder<yuki.TextOutputObject>()
    // applicationBuilder.use(new TextMergerMiddleware())
    applicationBuilder.use(
      new TextMergerMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Texts>('texts').merger
      )
    )
    applicationBuilder.use(
      new TextInterceptorMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Texts>('texts').interceptor
      )
    )
    applicationBuilder.use(
      new TextModifierMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Texts>('texts').modifier
      )
    )
    applicationBuilder.use(
      new MecabMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Default>('default').mecab
      )
    )
    applicationBuilder.use(new FilterMiddleware())
    applicationBuilder.use(this.publisherMap['thread-output'])

    debug('application builded')
  }

  private initHookerCallbacks () {
    this.hooker.on('output', (output) => {
      applicationBuilder.run(output)
    })
  }
}
