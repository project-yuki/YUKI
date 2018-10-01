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
      tempTranslationPattern: {
        [name: string]: any;
      };
    }
  }
}

// check & make ./logs and ./config folder
{
  if (!fs.existsSync("config")) {
    fs.mkdirSync("config");
    logger.debug("created ./config folder");
  }
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

global.tempTranslationPattern = {};

global.__baseDir = path.join(__dirname, "../..");
logger.debug(`basePath: ${global.__baseDir}`);

const iconPath = path.join(global.__baseDir, "build/icons/icon.png");

import setupIpc from "./setup/ipc";

let mainWindow: Electron.BrowserWindow | null;

let tray: Electron.Tray | null;

const mainWinURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

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
