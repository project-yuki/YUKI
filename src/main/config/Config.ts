import { app, ipcMain } from 'electron'
import * as fs from 'fs'
import { safeDump, safeLoad } from 'js-yaml'
import * as path from 'path'
import IpcTypes from '../../common/IpcTypes'
const debug = require('debug')('yuki:config')

abstract class Config {
  private static readonly FILE_OPTIONS = {
    EOL: '\r\n',
    spaces: 2
  }

  protected config: any

  protected filePath!: string
  protected filePathOld!: string
  protected isSaving: boolean = false

  public init () {
    this.filePath = path.resolve(global.__baseDir, `config/${this.getFilename()}.yaml`)
    this.filePathOld = path.resolve(global.__baseDir, `config/${this.getFilename()}.json`)
    this.load()
    this.save()
    debug('%s loaded with pre-save', this.filePath)
    this.registerWatchCallback()
    return this
  }

  public load () {
    let fileContent
    try {
      let filePath = this.filePath
      if (!fs.existsSync(this.filePath)) {
        filePath = this.filePathOld
      } else {
        this.filePathOld = ''
      }
      fileContent = safeLoad(fs.readFileSync(filePath, { encoding: 'utf-8' }), { json: true }) as Object
    } catch (e) {
      debug('%s loads failed !> %s', this.filePath, e)
      fileContent = {}
    }
    this.config = {
      ...this.getDefaultObject(),
      ...fileContent
    }
  }

  public save () {
    try {
      Config.FILE_OPTIONS;
      fs.writeFileSync(
        this.filePath, 
        safeDump(
          this.config,
          { indent: Config.FILE_OPTIONS.spaces }
        ).replace("\n", Config.FILE_OPTIONS.EOL)
      )
      debug('%s saved', this.filePath)
    } catch (e) {
      debug('%s saves failed !> %s', this.filePath, e)
    }

    try {
      if (this.filePathOld) {
        fs.unlinkSync(this.filePathOld)
        this.filePathOld = ''
        debug('%s deleted', this.filePathOld)
      }
    } catch (e) {
      debug('%s deletes failed !> %s', this.filePathOld, e)
    }
  }

  public get () {
    return this.config
  }

  public set (cfg: any) {
    this.config = cfg
    this.save()
  }

  public abstract getFilename (): string

  protected abstract getDefaultObject (): object

  private registerWatchCallback () {
    fs.watch(this.filePath, {}, () => {
      if (this.isSaving) return
      try {
        debug('%s changed. reloading...', this.getFilename())
        this.load()
        ipcMain.emit(IpcTypes.RELOAD_CONFIG, this.getFilename())
      } catch (e) {
        return
      }
    })
  }
}

export default Config
