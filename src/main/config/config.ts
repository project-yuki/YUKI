import { app } from 'electron'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import * as path from 'path'
const debug = require('debug')('yagt:config')

abstract class Config {
  private static readonly FILE_OPTIONS = {
    EOL: '\r\n',
    spaces: 2
  }

  protected config: any

  public init () {
    if (!fs.existsSync(
      path.resolve(global.__baseDir, `config/${this.getFilename()}.json`))) {
      this.config = this.getDefaultObject()
      this.save()
    } else {
      this.load()
    }
    return this
  }

  public abstract getFilename (): string

  public load () {
    const filePath = path.resolve(global.__baseDir, `config/${this.getFilename()}.json`)
    try {
      this.config = jsonfile.readFileSync(filePath)
      debug('%s loaded', filePath)
    } catch (e) {
      debug('%s loads failed !> %s', filePath, e)
      app.exit(-2)
    }
  }

  public save () {
    const filePath = path.resolve(global.__baseDir, `config/${this.getFilename()}.json`)
    try {
      jsonfile.writeFileSync(filePath, this.config, Config.FILE_OPTIONS)
      debug('%s saved', filePath)
    } catch (e) {
      debug('%s saves failed !> %s', filePath, e)
      app.exit(-2)
    }
  }

  public get () {
    return this.config
  }

  public set (cfg: any) {
    this.config = cfg
    this.save()
  }

  protected abstract getDefaultObject (): object
}

export default Config
