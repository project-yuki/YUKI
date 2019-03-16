import * as fs from 'fs'
import * as request from 'request'
const progress = require('request-progress')

interface IProgressState {
  // Overall percent (between 0 to 1)
  percent: number,
  // The download speed in bytes/sec
  speed: number,
  size: {
    // The total payload size in bytes
    total: number,
    // The transferred payload size in bytes
    transferred: number
  },
  time: {
    // The total elapsed seconds since the start (3 decimals)
    elapsed: number,
    // The remaining seconds to finish (3 decimals)
    remaining: number
  }
}

export default class Downloader {
  private endCallback: () => void
  private errorCallback: (err: Error) => void
  private downloadRequest: request.Request | undefined
  private progressCallback: (state: IProgressState) => void | undefined

  constructor (private fileUrl: string, private saveToPath: string) {
    this.progressCallback = () => { return }
    this.errorCallback = () => { return }
    this.endCallback = () => { return }
  }

  public start () {
    this.downloadRequest = request.get(this.fileUrl)
    progress(this.downloadRequest)
      .on('progress', (state: IProgressState) => {
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
  }

  public onProgress (callback: (state: IProgressState) => void) {
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
