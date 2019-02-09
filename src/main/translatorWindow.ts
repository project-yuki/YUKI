import { BrowserWindow } from "electron";
const electron = require("electron");
import hooker from "./hooker";
import Game from "./game";
import ConfigManager from "./config";
const debug = require("debug")("yagt:translatorWindow");
const electronVibrancy = require("electron-vibrancy");

export default class TranslatorWindow {
  private readonly URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9081/translator.html`
      : `file://${__dirname}/translator.html`;

  private window!: Electron.BrowserWindow;
  private game!: Game;

  private isRealClose = false;

  constructor() {
    this.create();
  }

  private create() {
    this.window = new BrowserWindow({
      webPreferences: {
        defaultFontFamily: {
          standard: "Microsoft Yahei UI",
          serif: "Microsoft Yahei UI",
          sansSerif: "Microsoft Yahei UI"
        }
      },
      show: false,
      alwaysOnTop: ConfigManager.getInstance().get("gui").translatorWindow
        .alwaysOnTop,
      transparent: true,
      frame: false
    });

    debug(
      "alwaysOnTop -> %s",
      ConfigManager.getInstance().get("gui").translatorWindow.alwaysOnTop
    );

    this.window.on("ready-to-show", () => {
      electronVibrancy.SetVibrancy(this.window, 0);

      debug("subscribing hooker events...");
      this.subscribeHookerEvents();
      debug("hooker events subscribed");
      this.window.show();
    });

    this.window.on("close", event => {
      if (!this.isRealClose) {
        event.preventDefault();
        this.window.hide();
      }

      debug("saving translator window bounds -> %o", this.window.getBounds());
      ConfigManager.getInstance().set("gui", {
        ...ConfigManager.getInstance().get("gui"),
        translatorWindow: {
          bounds: this.window.getBounds()
        }
      });
      debug(
        "saving translator window alwaysOnTop -> %s",
        this.window.isAlwaysOnTop()
      );
    });

    this.window.setBounds(
      ConfigManager.getInstance().get("gui").translatorWindow.bounds
    );

    this.window.loadURL(this.URL);
  }

  private subscribeHookerEvents() {
    hooker.getInstance().subscribe("thread-output", this.window.webContents);
  }

  getWindow() {
    return this.window;
  }

  close() {
    this.isRealClose = true;
    this.unsubscribeHookerEvents();
    this.window.close();
  }

  private unsubscribeHookerEvents() {
    hooker.getInstance().unsubscribe("thread-output", this.window.webContents);
  }

  setGame(game: Game) {
    this.game = game;
  }

  getGameInfo(): Yagt.Game {
    return this.game.getInfo();
  }
}
