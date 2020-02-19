import { exec } from 'child_process'
const debug = require('debug')('yuki:processes')

export default class Processes {
  public static async get () {
    return new Promise<yuki.Processes>((resolve, reject) => {
      exec(`${Processes.CHCP_COMMAND} & ${Processes.TASK_LIST_COMMAND}`,
        (err, stdout, stderr) => {
          if (err) {
            debug('exec failed !> %s', err)
            reject()
            return
          }

          if (this.findsProcessIn(stdout)) {
            const result = this.parseProcessesFrom(stdout)
            debug('get %d processes', result.length)
            resolve(result)
          } else {
            debug('exec failed. no process')
            reject()
          }
        }
      )
    })
  }
  private static CHCP_COMMAND = 'chcp 65001'
  private static TASK_LIST_COMMAND = 'tasklist /nh /fo csv /fi "sessionname eq Console"'

  private static findsProcessIn (value: string) {
    return value.indexOf('"') !== -1
  }

  private static parseProcessesFrom (value: string) {
    const processes: yuki.Processes = []

    const regexResult = value.match(/"([^"]+)"/g)
    if (!regexResult) return []

    let onePair: yuki.Process = { name: '', pid: -1 }
    for (let i = 0; i < regexResult.length; i++) {
      if (i % 5 === 0) {// process name
        onePair.name = regexResult[i].substr(1, regexResult[i].length - 2)
      } else if (i % 5 === 1) {// process id
        onePair.pid = parseInt(regexResult[i].substr(1, regexResult[i].length - 2), 10)
        processes.push(onePair)
        onePair = { name: '', pid: -1 }
      }
    }

    return processes
  }
}
