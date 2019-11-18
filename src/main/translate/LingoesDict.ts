import * as sqlite3 from 'sqlite3'
const debug = require('debug')('yuki:dict:lingoes')

export default class LingoesDict {
  private config: yuki.Config.LibraryItem
  private db: sqlite3.Database | undefined

  constructor (config: yuki.Config.LibraryItem) {
    this.config = config
    if (this.config.enable) {
      this.db = new sqlite3.Database(this.config.path)
      debug('loaded db file from path: %s', this.config.path)
    }
  }

  public find (word: string, callback: (result: yuki.DictResult) => void) {
    if (!this.db) return

    this.db.all('SELECT content from entry where word = ?', word, (err, rows) => {
      debug('raw rows from sqlite: %s -> %o', word, rows)

      if (err) {
        callback({ found: false })
        return
      }
      if ((!rows) || rows.length === 0) {
        callback({ found: false })
        return
      }

      callback({
        found: true,
        word,
        content: rows[0].content
      })
    })
  }

  public close () {
    if (this.db) this.db.close()
  }
}
