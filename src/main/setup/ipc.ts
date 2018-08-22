import { app, ipcMain } from 'electron'
import types from '../../common/ipcTypes'
import logger from '../../common/logger'
import defaultConfig from '../config/default'
import { hooker } from '../../common/hooker'

let hookerStarted = false

export default function (mainWindow: Electron.BrowserWindow) {
  ipcMain.on(types.MAIN_PAGE_LOAD_FINISHED, () => {
    if (!hookerStarted) {
      logger.info(`main page load finished.`)

      hooker.start()
      hooker.onThreadCreate(
        (tt: TextThread) => {
          logger.debug('thread created: ')
          logger.debug(tt)
          mainWindow.webContents.send(types.HAS_INSERTED_HOOK, tt)
        },
        (tt: TextThread, text: string) => {
          logger.debug(`get text [${tt.num}]: ${text}`)
          mainWindow.webContents.send(types.HAS_HOOK_TEXT, tt, text)
        }
      )
      hooker.onThreadRemove(
        (tt: RemovedTextThread) => {
          logger.debug('thread removed: ')
          logger.debug(tt)
          mainWindow.webContents.send(types.HAS_REMOVED_HOOK, tt)
        }
      )
      hooker.open()
      logger.debug(`injecting process ${defaultConfig.get().pid}...`)
      hooker.injectProcess(defaultConfig.get().pid)
      logger.debug(`process ${defaultConfig.get().pid} injected`)

      hookerStarted = true
    }
  })

  ipcMain.on(types.REQUEST_INSERT_HOOK, (event: Electron.Event, code: string) => {
    logger.debug(`inserting hook ${code} to process ${defaultConfig.get().pid}...`)
    hooker.insertHook(defaultConfig.get().pid, code)
    logger.debug(`hook ${code} inserted`)
  })

  ipcMain.on(types.REQUEST_REMOVE_HOOK, (event: Electron.Event, hook: TextThread) => {
    logger.debug(`removing hook ${hook.hook} from process ${defaultConfig.get().pid}...`)
    hooker.removeHook(defaultConfig.get().pid, hook.hook)
    logger.debug(`hook ${hook.hook} removed`)
  })

  ipcMain.on(types.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    let configFileName = `config/${name}.yml`
    logger.debug(`request config ${configFileName}`)
    switch (name) {
      case 'default':
        mainWindow.webContents.send(types.HAS_CONFIG, name, defaultConfig.get())
        break;
      case 'games':
        //TODO: set games config
        break;
      default:
        logger.error(`invalid config name: ${name}`)
        break;
    }
  })

  ipcMain.on(types.REQUEST_SAVE_CONFIG, (event: Electron.Event, name: string, cfg: any) => {
    let configFileName = `config/${name}.yml`
    logger.debug(`request saving config ${configFileName}: `)
    logger.debug(cfg)
    
    switch (name) {
      case 'default':
        defaultConfig.set(cfg)
        defaultConfig.save()
        logger.debug(`config ${configFileName} saved`)
        mainWindow.webContents.send(types.HAS_CONFIG, name, defaultConfig.get())
        break;
      case 'games':
        //TODO: set games config
        break;
      default:
        logger.error(`invalid config name: ${name}`)
        break;
    }
  })

  ipcMain.on(types.APP_EXIT, (event: Electron.Event) => {
    logger.debug('saving configurtion to file...')
    //TODO: save configuration to file
    logger.info('app exited')
    app.exit(0)
  })
}