import { exec } from 'child_process'
const debug = require('debug')('yuki:game')
import BaseGame from './BaseGame'
import ConfigManager from './config/ConfigManager'

export default class Game extends BaseGame {
  private static readonly TIMEOUT = 1000
  private static readonly MAX_RESET_TIME = 10
  private execString: string
  private path: string
  private code: string
  private name: string
  private localeChanger: string
  private exeName: string

  constructor (game: yuki.Game) {
    super()
    this.path = game.path
    this.execString = ''
    this.pids = []
    this.code = game.code
    this.name = game.name
    this.localeChanger = game.localeChanger
    this.exeName = ''
  }

  public start () {
    this.execGameProcess()
    this.registerHookerWithPid()
  }

  public getInfo (): yuki.Game {
    return {
      name: this.name,
      code: this.code,
      path: this.path,
      localeChanger: this.localeChanger
    }
  }

  private execGameProcess () {
    this.getRawExecStringOrDefault()
    this.replaceExecStringTokensWithActualValues()
    debug('exec string: %s', this.execString)
    exec(this.execString)
  }

  private getRawExecStringOrDefault () {
    const localeChangers = ConfigManager.getInstance().get<yuki.Config.Default>(
      'default'
    ).localeChangers
    if (this.localeChanger) {
      debug(
        'choose %s as locale changer',
        localeChangers[this.localeChanger].name
      )
      this.execString = localeChangers[this.localeChanger].exec
      return
    }
    debug('no locale changer chosed. use %GAME_PATH%')
    this.execString = '%GAME_PATH%'
  }

  private replaceExecStringTokensWithActualValues () {
    this.execString = this.execString.replace('%GAME_PATH%', `"${this.path}"`)
  }

  private async registerHookerWithPid () {
    this.exeName = this.path.substring(this.path.lastIndexOf('\\') + 1)
    debug('finding pid of %s...', this.exeName)
    try {
      await this.findPids()
    } catch (e) {
      debug('could not find game %s. abort', this.exeName)
      this.emit('abort')
      this.emit('exited')
      return
    }
    this.afterGetPids()
  }

  private findPids () {
    return new Promise((resolve, reject) => {
      let retryTimes = 0
      const pidGetterInterval = setInterval(() => {
        exec(
          `tasklist /nh /fo csv /fi "imagename eq ${this.exeName}"`,
          (err, stdout, stderr) => {
            if (err) throw err

            if (retryTimes >= Game.MAX_RESET_TIME) {
              clearInterval(pidGetterInterval)
              reject()
            }
            if (this.findsPidsIn(stdout)) {
              clearInterval(pidGetterInterval)
              this.pids = this.parsePidsFrom(stdout)
              debug('found game. pids %o', this.pids)
              resolve()
            } else {
              retryTimes++
              debug('could not find game. retry times...', retryTimes)
            }
          }
        )
      }, Game.TIMEOUT)
    })
  }

  private findsPidsIn (value: string) {
    return value.startsWith('"')
  }

  private parsePidsFrom (value: string) {
    const pids: number[] = []

    const regexResult = value.match(/"[^"]+"/g)
    if (!regexResult) return []

    for (let i = 0; i < regexResult.length; i++) {
      if (i % 5 !== 1) continue

      pids.push(parseInt(regexResult[i].replace('"', ''), 10))
    }
    return pids
  }
}
