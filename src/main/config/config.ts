import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
const debug = require('debug')('yagt:config')

abstract class Config {

  private static readonly FILE_OPTIONS = {
    EOL: '\r\n',
    spaces: 2
  }

  protected config: any

  public constructor () {
    if (!fs.existsSync(`config/${this.getFilename()}.json`)) {
      this.config = this.getDefaultObject()
      this.save()
    } else {
      this.load()
    }
  }
  public abstract getFilename (): string

  public load () {
    try {
      this.config = jsonfile.readFileSync(`config/${this.getFilename()}.json`)
      debug('%s loaded', `config/${this.getFilename()}.json`)
    } catch (e) {
      debug('%s loads failed !> %s', `config/${this.getFilename()}.json`, e)
    }
  }

  public save () {
    try {
      jsonfile.writeFileSync(
        `config/${this.getFilename()}.json`,
        this.config,
        Config.FILE_OPTIONS
      )
      debug('%s saved', `config/${this.getFilename()}.json`)
    } catch (e) {
      debug('%s saves failed !> %s', `config/${this.getFilename()}.json`, e)
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
