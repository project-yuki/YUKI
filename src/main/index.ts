import "babel-polyfill";
import { app, BrowserWindow, Tray, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";
const debug = require("debug")("yagt:app");

// check & make ./config folder
{
  if (!fs.existsSync("config\\")) {
    fs.mkdirSync("config");
    debug("created ./config folder");
  }
}

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

global.__baseDir = path.resolve(
  __dirname,
  process.env.NODE_ENV !== "development" ? "../../../.." : "../.."
);
debug("basePath: %s", global.__baseDir);

global.__appDir = path.resolve(__dirname, "../..");
debug("appPath: %s", global.__appDir);

const iconPath = path.join(global.__appDir, "build/icons/icon.png");

import setupIpc from "./setup/ipc";
import ConfigManager from "./config";

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
    useContentSize: true,
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

  mainWindow.on("close", () => {
    if (!mainWindow) return;

    debug("saving main window bounds -> %o", mainWindow.getBounds());
    ConfigManager.getInstance().set<Yagt.Config.Gui>("gui", {
      ...ConfigManager.getInstance().get("gui"),
      mainWindow: {
        bounds: mainWindow.getBounds()
      }
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.setBounds(
    ConfigManager.getInstance().get<Yagt.Config.Gui>("gui").mainWindow.bounds
  );

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
