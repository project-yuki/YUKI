import { exec } from 'child_process'
const debug = require('debug')('yuki:taskList')

interface ITask {name: string, pid: number}
export type Tasks = ITask[]

export default class TaskList {
  public static async get () {
    return new Promise<Tasks>((resolve, reject) => {
      exec(TaskList.TASK_LIST_COMMAND,
        (err, stdout, stderr) => {
          if (err) {
            debug('exec failed !> %s', err)
            reject()
            return
          }

          if (this.findsTaskIn(stdout)) {
            const result = this.parseTasksFrom(stdout)
            debug('get tasks: %o', result)
            resolve(result)
          } else {
            debug('exec failed. no task')
            reject()
          }
        }
      )
    })
  }
  private static TASK_LIST_COMMAND = 'tasklist /nh /fo csv /fi "sessionname eq Console"'

  private static findsTaskIn (value: string) {
    return value.startsWith('"')
  }

  private static parseTasksFrom (value: string) {
    const tasks: Tasks = []

    const regexResult = value.match(/"([^"]+)"/g)
    if (!regexResult) return []

    let onePair: ITask = { name: '', pid: -1 }
    for (let i = 0; i < regexResult.length; i++) {
      if (i % 5 === 0) {// process name
        onePair.name = regexResult[i].substr(1, regexResult[i].length - 2)
      } else if (i % 5 === 1) {// process id
        onePair.pid = parseInt(regexResult[i].substr(1, regexResult[i].length - 2), 10)
        tasks.push(onePair)
        onePair = { name: '', pid: -1 }
      }
    }

    return tasks
  }
}
