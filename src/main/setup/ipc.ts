import { app, dialog, ipcMain } from 'electron'
import IpcTypes from '../../common/IpcTypes'
const debug = require('debug')('yagt:ipc')
import { extname } from 'path'
import ConfigManager from '../config/ConfigManager'
import Game from '../Game'
import Hooker from '../Hooker'
import TranslationManager from '../translate/TranslationManager'
import TranslatorWindow from '../TranslatorWindow'

let runningGame: Game
let translatorWindow: TranslatorWindow | null

export default function (mainWindow: Electron.BrowserWindow) {
  ipcMain.on(IpcTypes.MAIN_PAGE_LOAD_FINISHED, () => {
    debug('main page load finished. starting apis...')
    TranslationManager.getInstance().initializeApis(
      ConfigManager.getInstance().get<Yagt.Config.Default>('default').onlineApis
    )
    TranslationManager.getInstance().initializeTranslators(
      ConfigManager.getInstance().get<Yagt.Config.Default>('default')
        .translators
    )
    debug('apis started')
  })

  ipcMain.on(
    IpcTypes.REQUEST_RUN_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      mainWindow.hide()

      runningGame = new Game(game)
      runningGame.on('started', () => {
        if (translatorWindow) translatorWindow.close()
        translatorWindow = new TranslatorWindow()
        translatorWindow.setGame(runningGame)
      })
      runningGame.on('exited', () => {
        if (translatorWindow) translatorWindow.close()
        translatorWindow = null
        mainWindow.show()
      })
      runningGame.start()
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_INSERT_HOOK,
    (event: Electron.Event, code: string) => {
      if (code !== '') {
        Hooker.getInstance().insertHook(runningGame.getPid(), code)
      }
    }
  )

  ipcMain.on(IpcTypes.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    if (name === 'game') {
      requestGame(event)
      return
    }
    debug('request config %s', ConfigManager.getInstance().getFilename(name))
    sendConfig(name, event)
  })

  function requestGame (event: Electron.Event) {
    if (translatorWindow) {
      debug('request config %o', translatorWindow.getGameInfo())
      sendGameInfo(event)
    } else {
      debug(`no translator window`)
    }
  }

  ipcMain.on(
    IpcTypes.REQUEST_SAVE_CONFIG,
    (event: Electron.Event, name: string, cfg: any) => {
      const configFileName = ConfigManager.getInstance().getFilename(name)
      debug(`request saving config %s...`, configFileName)
      ConfigManager.getInstance().set(name, cfg)
      debug('config %s saved. resend it to window', configFileName)
      sendConfig(name, event)
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI,
    (event: Electron.Event, cfg: any) => {
      debug('request saving translator gui config...')
      ConfigManager.getInstance().set<Yagt.Config.Gui>('gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: cfg
      })
      debug('translator gui config saved')
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_ADD_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      ConfigManager.getInstance()
        .get<Yagt.Config.Games>('games')
        .push(game)
      ConfigManager.getInstance().save('games')
      sendConfig('games', event)
      event.sender.send(IpcTypes.HAS_ADDED_GAME)
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_REMOVE_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      ConfigManager.getInstance().set<Yagt.Config.Games>(
        'games',
        ConfigManager.getInstance()
          .get<Yagt.Config.Games>('games')
          .filter((item: Yagt.Game) => item.name !== game.name)
      )
      sendConfig('games', event)
    }
  )

  ipcMain.on(IpcTypes.REQUEST_NEW_GAME_PATH, (event: Electron.Event) => {
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: [{ name: '可执行文件', extensions: ['exe'] }]
      },
      (files) => {
        if (files) {
          event.sender.send(IpcTypes.HAS_NEW_GAME_PATH, files[0])
        }
      }
    )
  })

  ipcMain.on(
    IpcTypes.REQUEST_PATH_WITH_FILE,
    (event: Electron.Event, filename: string) => {
      const extension = extname(filename).substring(1)
      dialog.showOpenDialog(
        {
          title: `请选择文件夹下的 ${filename}`,
          properties: ['openFile'],
          filters: [{ name: extension, extensions: [extension] }]
        },
        (files) => {
          if (files) {
            event.sender.send(IpcTypes.HAS_PATH_WITH_FILE, files[0])
          }
        }
      )
    }
  )

  ipcMain.on(IpcTypes.APP_EXIT, () => {
    app.quit()
  })

  ipcMain.on(
    IpcTypes.REQUEST_TRANSLATION,
    (event: Electron.Event, text: string) => {
      TranslationManager.getInstance().translate(text, (translation) => {
        event.sender.send(IpcTypes.HAS_TRANSLATION, translation)
      })
    }
  )
}

function sendConfig (configName: string, event: Electron.Event) {
  event.sender.send(
    IpcTypes.HAS_CONFIG,
    configName,
    ConfigManager.getInstance().get(configName)
  )
}

function sendGameInfo (event: Electron.Event) {
  event.sender.send(
    IpcTypes.HAS_CONFIG,
    'game',
    (translatorWindow as TranslatorWindow).getGameInfo()
  )
}

app.on('before-quit', () => {
  if (translatorWindow) {
    require('debug')('yagt:app')('closing translator window...')
    translatorWindow.close()
    translatorWindow = null
    require('debug')('yagt:app')('translator window closed')
  }
  require('debug')('yagt:app')('app quited')
})
