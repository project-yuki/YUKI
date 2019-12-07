import { BrowserWindow } from 'electron'
import BaseGame from './BaseGame'
import ConfigManager from './config/ConfigManager'
import Game from './Game'
import Hooker from './Hooker'
const debug = require('debug')('yuki:translatorWindow')
const ElectronVibrancy = require('electron-vibrancy')

export default class TranslatorWindow {
  private readonly URL =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9081/translator.html`
      : `file://${__dirname}/translator.html`

  private window!: Electron.BrowserWindow
  private game!: BaseGame

  private isRealClose = false
  private config!: yuki.Config.Gui['translatorWindow']

  constructor () {
    this.create()
  }

  public getWindow () {
    return this.window
  }

  public close () {
    this.isRealClose = true
    this.unsubscribeHookerEvents()
    this.window.close()
  }

  public setGame (game: BaseGame) {
    this.game = game
  }

  public getGameInfo (): yuki.Game {
    return this.game.getInfo()
  }

  private create () {
    this.config = ConfigManager.getInstance().get<yuki.Config.Gui>('gui')
                  .translatorWindow
    this.window = new BrowserWindow({
      webPreferences: {
        defaultFontFamily: {
          standard: 'Microsoft Yahei UI',
          serif: 'Microsoft Yahei UI',
          sansSerif: 'Microsoft Yahei UI'
        }
      },
      show: false,
      alwaysOnTop: this.config.alwaysOnTop,
      transparent: true,
      frame: false
    })

    debug(
      'alwaysOnTop -> %s',
      ConfigManager.getInstance().get<yuki.Config.Gui>('gui').translatorWindow
        .alwaysOnTop
    )

    this.window.on('ready-to-show', () => {
      // choose translucent as default, unless assigning transparent explicitly
      if (this.config.renderMode !== 'transparent') {
        ElectronVibrancy.SetVibrancy(this.window, 0)
      }

      debug('subscribing hooker events...')
      this.subscribeHookerEvents()
      debug('hooker events subscribed')
      this.window.show()
    })

    this.window.on('close', (event) => {
      if (!this.isRealClose) {
        event.preventDefault()
        this.window.hide()
      }

      debug('saving translator window bounds -> %o', this.window.getBounds())
      debug(
        'saving translator window alwaysOnTop -> %s',
        this.window.isAlwaysOnTop()
      )
      ConfigManager.getInstance().set<yuki.Config.Gui>('gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: {
          ...ConfigManager.getInstance().get<yuki.Config.Gui>('gui')
            .translatorWindow,
          bounds: this.window.getBounds(),
          alwaysOnTop: this.window.isAlwaysOnTop()
        }
      })
    })

    this.window.setBounds(
      ConfigManager.getInstance().get<yuki.Config.Gui>('gui').translatorWindow
        .bounds
    )

    this.window.loadURL(this.URL)
  }

  private subscribeHookerEvents () {
    Hooker.getInstance().subscribe('thread-output', this.window.webContents)
  }

  private unsubscribeHookerEvents () {
    Hooker.getInstance().unsubscribe('thread-output', this.window.webContents)
  }
}
