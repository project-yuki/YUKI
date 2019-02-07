import "babel-polyfill";
import { app, BrowserWindow, Tray, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";

import logger from "../common/logger";
logger.initialize();

// to make TypeScript happy :)
declare global {
  namespace NodeJS {
    export interface Global {
      __static: string;
      __baseDir: string;
      __appDir: string;
      tempTranslationPattern: {
        [name: string]: any;
      };
    }
  }
}

// check & make ./log and ./config folder
{
  if (!fs.existsSync("log\\")) {
    fs.mkdirSync("log");
    logger.warn("created ./log folder");
  }
  if (!fs.existsSync("config\\")) {
    fs.mkdirSync("config");
    logger.warn("created ./config folder");
  }
}

import ConfigManager from "./config";
logger.initialize(ConfigManager.getInstance().get("default").logLevel);

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

global.tempTranslationPattern = {};

global.__baseDir = path.resolve(
  __dirname,
  process.env.NODE_ENV !== "development" ? "../../../.." : "../.."
);
logger.debug(`basePath: ${global.__baseDir}`);

global.__appDir = path.resolve(__dirname, "../..");
logger.debug(`appPath: ${global.__appDir}`);

const iconPath = path.join(global.__appDir, "build/icons/icon.png");

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
