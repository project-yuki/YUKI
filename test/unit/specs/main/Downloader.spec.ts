import { expect } from 'chai'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import Downloader from '../../../../src/main/Downloader'

describe('Downloader', () => {
  it('downloads file into specific path', (done) => {
    const filename = 'Dism++10.1.1000.90_f670d6439af2f4cd2090d7d348fa56b7547d02a4.zip'
    const filePath = join(__dirname, '../../temp', filename)
    new Downloader(
      `http://cdn.chuyu.me/${filename}`,
      filePath
    )
    .onEnd(() => {
      expect(existsSync(filePath)).to.equal(true)
      unlinkSync(filePath)
      done()
    })
    .start()
  }).timeout(30000)

  it('deletes local file when explicitly call abort()', (done) => {
    const filename = 'Dism++10.1.1000.90_f670d6439af2f4cd2090d7d348fa56b7547d02a4.zip'
    const filePath = join(__dirname, '../../temp', filename)
    const downloader = new Downloader(
      `http://cdn.chuyu.me/${filename}`,
      filePath
    )
    .onError((err) => {
      throw err
    })
    .onEnd(() => {
      expect(existsSync(filePath)).to.equal(false)
      done()
    })
    .start()

    setTimeout(() => {
      downloader.abort()
    }, 100)
  }).timeout(30000)
})
