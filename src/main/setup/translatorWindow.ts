import { BrowserWindow } from "electron";
const electron = require("electron");
import hooker from "../../common/hooker";
import Game from "../game";

export default class TranslatorWindow {
  private readonly URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9081/translator.html`
      : `file://${__dirname}/translator.html`;

  private readonly X_OFFSET = 0.2;
  private readonly Y_OFFSET = 0.1;

  private window!: Electron.BrowserWindow;
  private game!: Game;

  private isRealClose = false;

  constructor() {
    this.create();
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
      alwaysOnTop: true
    });

    this.window.once("ready-to-show", () => {
      console.debug("subscribing hooker events...");
      this.subscribeHookerEvents();
      this.window.show();
    });

    this.window.on("close", event => {
      if (!this.isRealClose) {
        event.preventDefault();
        this.window.hide();
      }
    });

    this.window.setPosition(
      ~~(primaryDisplaySize.width * this.X_OFFSET),
      ~~(primaryDisplaySize.height * this.Y_OFFSET)
    );

    this.window.loadURL(this.URL);
  }

  private subscribeHookerEvents() {
    hooker.subscribe("thread-create", this.window.webContents);
    hooker.subscribe("thread-remove", this.window.webContents);
    hooker.subscribe("thread-output", this.window.webContents);
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
    hooker.unsubscribe("thread-create", this.window.webContents);
    hooker.unsubscribe("thread-remove", this.window.webContents);
    hooker.unsubscribe("thread-output", this.window.webContents);
  }

  setGame(game: Game) {
    this.game = game;
  }
}
