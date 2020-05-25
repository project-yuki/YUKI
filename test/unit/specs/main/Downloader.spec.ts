import { expect } from 'chai'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import Downloader from '../../../../src/main/Downloader'

describe('Downloader', () => {
  it('downloads file into specific path', (done) => {
    const filename = 'favicon.ico'
    const filePath = join(__dirname, '../../temp', filename)
    new Downloader(
      `https://www.bilibili.com/${filename}`,
      filePath
    )
    .onError((err) => {
      done(err)
    })
    .onEnd(() => {
      expect(existsSync(filePath)).to.equal(true)
      unlinkSync(filePath)
      done()
    })
    .start()
  }).timeout(5000)

  it('deletes local file when explicitly call abort()', (done) => {
    const filename = 'favicon.ico'
    const filePath = join(__dirname, '../../temp', filename)
    const downloader = new Downloader(
      `https://www.bilibili.com/${filename}`,
      filePath
    )
    .onError((err) => {
      expect(err.message).to.equal('download aborted')
      expect(existsSync(filePath)).to.equal(false)
      done()
    })
    .start()

    setTimeout(() => {
      downloader.abort()
    }, 1)
  }).timeout(5000)
})
