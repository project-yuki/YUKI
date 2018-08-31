import { app, BrowserWindow, Tray, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";

import logger from "../common/logger";

// to make TypeScript happy :)
declare global {
  namespace NodeJS {
    export interface Global {
      __static: string;
      __baseDir: string;
    }
  }
}

// check & make ./logs folder
{
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
    logger.debug("created ./logs folder");
  }
}

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

global.__baseDir = path.join(__dirname, "../..");
logger.debug(`basePath: ${global.__baseDir}`);

const iconPath = path.join(global.__baseDir, "build/icons/icon.png");

import setupIpc from "./setup/ipc";

let mainWindow: Electron.BrowserWindow | null;
let translatorWindow: Electron.BrowserWindow | null;

let tray: Electron.Tray | null;

const mainWinURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

const translatorWinURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9081/translator.html`
    : `file://${__dirname}/translator.html`;

function openWindow() {
  if (!mainWindow) {
    createWindow();
  } else if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
}

function createWindow() {
  /**
   * Initial main window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1280,
    webPreferences: {
      defaultFontFamily: {
        standard: "Microsoft Yahei UI",
        serif: "Microsoft Yahei UI",
        sansSerif: "Microsoft Yahei UI"
      }
    },
    icon: iconPath,
    frame: false
  });

  mainWindow.loadURL(mainWinURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开主界面",
      type: "normal",
      click: () => {
        openWindow();
      }
    },
    {
      label: "退出",
      type: "normal",
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Yagt");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    openWindow();
  });

  setupIpc(mainWindow);

  /**
   * Initial translator window options
   */
  translatorWindow = new BrowserWindow({
    height: 240,
    useContentSize: true,
    width: 1080,
    webPreferences: {
      defaultFontFamily: {
        standard: "Microsoft Yahei UI",
        serif: "Microsoft Yahei UI",
        sansSerif: "Microsoft Yahei UI"
      }
    },
    icon: iconPath
  });

  translatorWindow.loadURL(translatorWinURL);

  translatorWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("before-quit", () => {
  logger.info("app quited");
});

app.on("activate", () => {
  if (!mainWindow) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
