import { BrowserWindow } from "electron";
const electron = require("electron");

const translatorWinURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9081/translator.html`
    : `file://${__dirname}/translator.html`;

/**
 * Initial translator window options
 */
let translatorWindow: Electron.BrowserWindow | null;

export default function createTranslatorWindow() {
  if (!translatorWindow || translatorWindow.isDestroyed()) {
    const X_OFFSET = 0.2;
    const Y_OFFSET = 0.1;
    let primaryDisplaySize = electron.screen.getPrimaryDisplay().size;

    translatorWindow = new BrowserWindow({
      height: 240,
      width: ~~(primaryDisplaySize.width * (1 - 2 * X_OFFSET)),
      webPreferences: {
        defaultFontFamily: {
          standard: "Microsoft Yahei UI",
          serif: "Microsoft Yahei UI",
          sansSerif: "Microsoft Yahei UI"
        }
      }
    });

    translatorWindow.setPosition(
      ~~(primaryDisplaySize.width * X_OFFSET),
      ~~(primaryDisplaySize.height * Y_OFFSET)
    );

    translatorWindow.loadURL(translatorWinURL);

    translatorWindow.on("closed", () => {
      translatorWindow = null;
    });
  }
  return translatorWindow;
}
