import { app, ipcMain } from 'electron'
import types from '../../common/ipcTypes'
import logger from '../../common/logger'
import config from '../setup/config'

config.load('config/config.yml')

const hooker = require('../../../nexthooker')

let hookerStarted = false

export default function (mainWindow) {
  ipcMain.on(types.MAIN_PAGE_LOAD_FINISHED, () => {
    if (!hookerStarted) {
      logger.info(`main page load finished.`)

      hooker.start()
      hooker.onThreadCreate(
        (tt) => {
          logger.debug('thread created: ')
          logger.debug(tt)
          mainWindow.webContents.send(types.ADD_HOOK, tt)
        },
        (tt, text) => {
          logger.debug(`get text [${tt.num}]: ${text}`)
          mainWindow.webContents.send(types.GET_HOOK_TEXT, tt, text)
        }
      )
      hooker.open()
      logger.debug(`injecting process ${config.get().pid}...`)
      hooker.injectProcess(config.get().pid)
      logger.debug(`process ${config.get().pid} injected`)

      hookerStarted = true
    }
  })

  ipcMain.on(types.INSERT_HOOK, (event, code) => {
    logger.debug(`inserting hook ${code} to process ${config.get().pid}...`)
    hooker.insertHook(config.get().pid, code)
    logger.debug(`hook ${code} inserted`)
  })

  ipcMain.on(types.REMOVE_HOOK, (event, hook) => {
    logger.debug(`removing hook ${hook.hook} from process ${config.get().pid}...`)
    hooker.removeHook(config.get().pid, hook.hook)
    logger.debug(`hook ${hook.hook} removed`)
  })

  ipcMain.on(types.APP_EXIT, (event) => {
    logger.debug('saving configurtion to file...')
    //TODO: save configuratino to file
    logger.info('app exited')
    app.exit(0)
  })
}