import { ipcMain } from 'electron'
import { unlinkSync } from 'fs'
import * as path from 'path'
import IpcTypes from '../common/IpcTypes'
import ConfigManager from './config/ConfigManager'
import Downloader from './Downloader'
const extract = require('extract-zip')
const debug = require('debug')

export default class DownloaderFactory {
  public static LIBRARY_BASE_REPO = ''
  public static LIBRARY_BASE_STORE_PATH = ''

  public static init () {
    this.LIBRARY_BASE_REPO = ConfigManager.getInstance()
      .get<Yagt.Config.Default>('default').librariesRepoUrl
    this.LIBRARY_BASE_STORE_PATH = path.resolve(global.__baseDir, 'lib')
    debug('yagt:downloader:factory')('library base repo -> %s', this.LIBRARY_BASE_REPO)
    debug('yagt:downloader:factory')('library base store path -> %s', this.LIBRARY_BASE_STORE_PATH)
  }

  public static makeLibraryDownloader (packName: string): Downloader {
    return new Downloader(
      `${this.LIBRARY_BASE_REPO}${packName}.zip`,
      `${this.LIBRARY_BASE_STORE_PATH}\\${packName}.zip`
    ).onProgress((state) => {
      debug('yagt:downloader:library')('[%s] downloading -> %O', packName, state)
      ipcMain.emit(IpcTypes.HAS_DOWNLOAD_PROGRESS, packName, state)
    }).onError((err) => {
      debug('yagt:downloader:library')('[%s] download error !> %s', packName, err)
    }).onEnd(() => {
      debug('yagt:downloader:library')('[%s] download complete', packName)
      extract(
        `${this.LIBRARY_BASE_STORE_PATH}\\${packName}.zip`,
        { dir: this.LIBRARY_BASE_STORE_PATH },
        (err: Error) => {
          if (err) {
            debug('yagt:downloader:library')('[%s] unzip error !> %s', packName, err)
            return
          }

          debug('yagt:downloader:library')('[%s] unzip complete', packName)
          unlinkSync(`${this.LIBRARY_BASE_STORE_PATH}\\${packName}.zip`)
          ipcMain.emit(IpcTypes.HAS_DOWNLOAD_COMPLETE, packName)
        }
      )
    })
  }
}
