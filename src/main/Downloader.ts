import * as fs from 'fs'
import * as request from 'request'
const progress = require('request-progress')

export default class Downloader {
  private endCallback: () => void
  private errorCallback: (err: Error) => void
  private downloadRequest: request.Request | undefined
  private progressCallback: (state: RequestProgress.ProgressState) => void | undefined

  constructor (private fileUrl: string, private saveToPath: string) {
    this.progressCallback = () => { return }
    this.errorCallback = () => { return }
    this.endCallback = () => { return }
  }

  public start () {
    this.downloadRequest = request.get(this.fileUrl)
    progress(this.downloadRequest)
      .on('progress', (state: RequestProgress.ProgressState) => {
        this.progressCallback(state)
      })
      .on('error', (err: Error) => {
        this.errorCallback(err)
      })
      .on('end', () => {
        this.endCallback()
      })
      .pipe(fs.createWriteStream(this.saveToPath))
    return this
  }

  public pause () {
    if (!this.downloadRequest) return
    this.downloadRequest.pause()
  }
  public resume () {
    if (!this.downloadRequest) return
    this.downloadRequest.resume()
  }
  public abort () {
    if (!this.downloadRequest) return
    this.downloadRequest.abort()

    if (fs.existsSync(this.saveToPath)) {
      fs.unlinkSync(this.saveToPath)
    }

    this.errorCallback(new Error('download aborted'))
  }

  public onProgress (callback: (state: RequestProgress.ProgressState) => void) {
    this.progressCallback = callback
    return this
  }
  public onEnd (callback: () => void) {
    this.endCallback = callback
    return this
  }
  public onError (callback: (err: Error) => void) {
    this.errorCallback = callback
    return this
  }
}
