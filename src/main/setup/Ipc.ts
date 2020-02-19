import { app, dialog, ipcMain } from 'electron'
import IpcTypes from '../../common/IpcTypes'
const debug = require('debug')('yuki:ipc')
import { extname } from 'path'
import { format } from 'util'
import BaseGame from '../BaseGame'
import ConfigManager from '../config/ConfigManager'
import DownloaderFactory from '../DownloaderFactory'
import Game from '../Game'
import GameFromProcess from '../GameFromProcess'
import Hooker from '../Hooker'
import Processes from '../Processes'
import DictManager from '../translate/DictManager'
import TranslationManager from '../translate/TranslationManager'
import TranslatorWindow from '../TranslatorWindow'

let runningGame: BaseGame
let translatorWindow: TranslatorWindow | null

export default function (mainWindow: Electron.BrowserWindow) {
  require('debug').log = (message: any, ...optionalParams: any[]) => {
    // tslint:disable-next-line: no-console
    console.log(message, ...optionalParams)
    mainWindow.webContents.send(
      IpcTypes.HAS_NEW_DEBUG_MESSAGE,
      format(message, ...optionalParams)
    )
  }

  ipcMain.on(IpcTypes.MAIN_PAGE_LOAD_FINISHED, () => {
    debug('main page load finished. starting apis...')
    TranslationManager.getInstance().initializeApis(
      ConfigManager.getInstance().get<yuki.Config.Default>('default').onlineApis
    )
    TranslationManager.getInstance().initializeTranslators(
      ConfigManager.getInstance().get<yuki.Config.Default>('default')
        .translators
    )
    debug('apis started')
  })

  ipcMain.on(
    IpcTypes.REQUEST_RUN_GAME,
    (event: Electron.Event, game?: yuki.Game, process?: yuki.Process) => {
      if (game) {
        runningGame = new Game(game)
      } else if (process) {
        runningGame = new GameFromProcess(process)
      } else return
      runningGame.on('started', () => {
        mainWindow.hide()
        mainWindow.webContents.send(IpcTypes.HAS_RUNNING_GAME)

        if (translatorWindow) translatorWindow.close()
        translatorWindow = new TranslatorWindow()
        translatorWindow.setGame(runningGame)
      })
      runningGame.on('exited', () => {
        if (translatorWindow) translatorWindow.close()
        translatorWindow = null
        mainWindow.show()
      })
      runningGame.on('abort', () => {
        mainWindow.webContents.send(IpcTypes.GAME_ABORTED)
      })
      runningGame.start()
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_INSERT_HOOK,
    (event: Electron.Event, code: string) => {
      if (code !== '') {
        runningGame.getPids().map((pid) => {
          Hooker.getInstance().insertHook(pid, code)
        })
      }
    }
  )

  ipcMain.on(IpcTypes.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    if (name === 'game') {
      requestGame(event)
      return
    }
    if (name === 'librariesBaseStorePath') {
      sendLibrariesBaseStorePath(event)
      return
    }
    debug('request config %s', ConfigManager.getInstance().getFilename(name))
    sendConfig(name, event)
  })

  ipcMain.on(IpcTypes.RELOAD_CONFIG, (name: string) => {
    const configName = ConfigManager.getInstance().getFilename(name)
    debug('reloading config %s', configName)
    mainWindow.webContents.send(
      IpcTypes.HAS_CONFIG,
      configName,
      ConfigManager.getInstance().get(configName)
    )
    if (translatorWindow) {
      translatorWindow.getWindow().webContents.send(
        IpcTypes.HAS_CONFIG,
        configName,
        ConfigManager.getInstance().get(configName)
      )
    }
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
      Hooker.getInstance().rebuild()
      debug('resend config %s to window', configFileName)
      sendConfig(name, event)
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI,
    (event: Electron.Event, cfg: any) => {
      debug('request saving translator gui config...')
      ConfigManager.getInstance().set<yuki.Config.Gui>('gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: cfg
      })
      debug('translator gui config saved')
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_ADD_GAME,
    (event: Electron.Event, game: yuki.Game) => {
      ConfigManager.getInstance()
        .get<yuki.Config.Games>('games')
        .push(game)
      ConfigManager.getInstance().save('games')
      sendConfig('games', event)
      event.sender.send(IpcTypes.HAS_ADDED_GAME)
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_REMOVE_GAME,
    (event: Electron.Event, game: yuki.Game) => {
      ConfigManager.getInstance().set<yuki.Config.Games>(
        'games',
        ConfigManager.getInstance()
          .get<yuki.Config.Games>('games')
          .filter((item: yuki.Game) => item.name !== game.name)
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
    (event: Electron.Event, message: { id: number, text: string }) => {
      TranslationManager.getInstance().translate(message.text, (translation) => {
        try {
          event.sender.send(IpcTypes.HAS_TRANSLATION, { id: message.id, translation })
        } catch (e) {
          return
        }
      })
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_DICT,
    (event: Electron.Event, message: { dict: string, word: string }) => {
      DictManager.find(message, (result) => {
        event.sender.send(IpcTypes.HAS_DICT, result)
      })
    }
  )

  ipcMain.on(
    IpcTypes.HAS_DOWNLOAD_PROGRESS,
    (packName: string, state: RequestProgress.ProgressState) => {
      mainWindow.webContents.send(IpcTypes.HAS_DOWNLOAD_PROGRESS, packName, state)
    }
  )

  ipcMain.on(
    IpcTypes.HAS_DOWNLOAD_COMPLETE,
    (packName: string, err: string | undefined) => {
      mainWindow.webContents.send(IpcTypes.HAS_DOWNLOAD_COMPLETE, packName, err)
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_DOWNLOAD_LIBRARY,
    (event: Electron.Event, packName: string) => {
      DownloaderFactory.makeLibraryDownloader(packName).start()
    }
  )

  ipcMain.on(
    IpcTypes.REQUEST_PROCESSES,
    (event: Electron.Event) => {
      Processes.get().then((processes) => {
        event.sender.send(IpcTypes.HAS_PROCESSES, processes)
      }).catch(() => {
        event.sender.send(IpcTypes.HAS_PROCESSES, [])
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

function sendLibrariesBaseStorePath (event: Electron.Event) {
  event.sender.send(
    IpcTypes.HAS_CONFIG,
    'librariesBaseStorePath',
    DownloaderFactory.LIBRARY_BASE_STORE_PATH
  )
}

app.on('before-quit', () => {
  if (translatorWindow) {
    require('debug')('yuki:app')('closing translator window...')
    translatorWindow.close()
    translatorWindow = null
    require('debug')('yuki:app')('translator window closed')
  }
  require('debug')('yuki:app')('app quited')
})
