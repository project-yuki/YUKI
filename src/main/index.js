'use strict'

import constants from '../constants'

import { app, BrowserWindow, ipcMain } from 'electron'
const hooker = require('../../nexthooker')

let hookerStarted

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1280,
    webPreferences: {
      defaultFontFamily: {
        standard: 'Microsoft Yahei UI',
        serif: 'Microsoft Yahei UI',
        sansSerif: 'Microsoft Yahei UI'
      }
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('load-finished', () => {
    if (!hookerStarted) {
      console.log(`load finished.`)

      hooker.start()
      hooker.onThreadCreate(
        (tt) => {
          // console.log(tt)
          mainWindow.webContents.send('add-hook', tt)
        },
        (tt, text) => {
          // console.log(`${tt.num}: ${text}`)
          mainWindow.webContents.send('get-hook-text', tt, text)
        }
      )
      hooker.open()
      console.log(`injecting process ${constants.PID}...`)
      hooker.injectProcess(constants.PID)
      console.log(`process ${constants.PID} injected`)

      hookerStarted = true
    }
  })

  ipcMain.on('insert-hook', (event, code) => {
    hooker.insertHook(constants.PID, code)
  })

  ipcMain.on('remove-hook', (event, hook) => {
    hooker.removeHook(constants.PID, hook.hook)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

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
