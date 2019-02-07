import { BrowserWindow } from "electron";
const electron = require("electron");
import hooker from "./hooker";
import Game from "./game";
import logger from "../common/logger";
const electronVibrancy = require("electron-vibrancy");
import { ResizeMonitor } from "win32-monitor-window-resize";

export default class TranslatorWindow {
  private readonly URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9081/translator.html`
      : `file://${__dirname}/translator.html`;

  private readonly X_OFFSET = 0.2;
  private readonly Y_OFFSET = 0.1;

  private window!: Electron.BrowserWindow;
  private game: Game;
  private resizeMonitor!: ResizeMonitor;

  private isRealClose = false;

  constructor(game: Game) {
    this.game = game;
    this.create();
  }

  private registerResizeMonitor() {
    this.resizeMonitor = new ResizeMonitor(this.game.getPid());
    this.resizeMonitor.on("resize", rect => {
      let primaryDisplayScaleFactor = electron.screen.getPrimaryDisplay()
        .scaleFactor;

      rect.left /= primaryDisplayScaleFactor;
      rect.top /= primaryDisplayScaleFactor;
      rect.right /= primaryDisplayScaleFactor;
      rect.bottom /= primaryDisplayScaleFactor;

      const windowSize = this.window.getSize();

      this.window.setBounds({
        width: windowSize[0],
        height: windowSize[1],
        x: ~~(rect.left + (rect.right - rect.left - windowSize[0]) / 2),
        y: ~~(rect.top + (rect.bottom - rect.top - windowSize[1]) / 2)
      });
    });
  }

  private create() {
    let primaryDisplaySize = electron.screen.getPrimaryDisplay().size;

    this.window = new BrowserWindow({
      height: 240,
      width: ~~(primaryDisplaySize.width * (1 - 2 * this.X_OFFSET)),
      webPreferences: {
        defaultFontFamily: {
          standard: "Microsoft Yahei UI",
          serif: "Microsoft Yahei UI",
          sansSerif: "Microsoft Yahei UI"
        }
      },
      show: false,
      alwaysOnTop: true,
      transparent: true,
      frame: false
    });

    this.window.on("ready-to-show", () => {
      electronVibrancy.SetVibrancy(this.window, 0);

      this.registerResizeMonitor();

      logger.debug("subscribing hooker events...");
      this.subscribeHookerEvents();
      this.window.show();
    });

    this.window.on("close", event => {
      if (!this.isRealClose) {
        event.preventDefault();
        this.window.hide();
      }
    });

    this.window.loadURL(this.URL);
  }

  private subscribeHookerEvents() {
    hooker.getInstance().subscribe("thread-create", this.window.webContents);
    hooker.getInstance().subscribe("thread-remove", this.window.webContents);
    hooker.getInstance().subscribe("thread-output", this.window.webContents);
  }

  getWindow() {
    return this.window;
  }

  close() {
    this.isRealClose = true;
    this.unsubscribeHookerEvents();
    this.resizeMonitor.kill();
    this.window.close();
  }

  private unsubscribeHookerEvents() {
    hooker.getInstance().unsubscribe("thread-create", this.window.webContents);
    hooker.getInstance().unsubscribe("thread-remove", this.window.webContents);
    hooker.getInstance().unsubscribe("thread-output", this.window.webContents);
  }

  getGameInfo(): Yagt.Game {
    return this.game.getInfo();
  }
}
