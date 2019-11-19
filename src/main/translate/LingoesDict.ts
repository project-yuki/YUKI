import * as sqlite3 from 'sqlite3'
import * as xml2js from 'xml2js'
const debug = require('debug')('yuki:dict:lingoes')

export default class LingoesDict {

  public static contentToObject (
    content: string,
    callback: (pattern?: yuki.LingoesPattern) => void
  ) {
    try {
      xml2js.parseString(content, (err, result: any) => {
        if (err) callback()

        const refinedResult: yuki.LingoesPattern = {}
        let parseResult: any = { ...result }
        if (!parseResult.C) {
          callback()
          return
        }
        parseResult = parseResult.C
        if (!parseResult.F) {
          callback()
          return
        }
        parseResult = parseResult.F
        if (!parseResult[0]) {
          callback()
          return
        }
        parseResult = parseResult[0]
        if (parseResult.H) {// parse kana
          let kanaResult = parseResult.H
          if (kanaResult[0]) {
            kanaResult = kanaResult[0]
            if (kanaResult.M) {
              kanaResult = kanaResult.M
            }
            refinedResult.kana = kanaResult
          }
        }

        if (!parseResult.I) {
          callback(refinedResult)
          return
        }
        parseResult = parseResult.I
        if (!parseResult[0]) {
          callback(refinedResult)
          return
        }
        parseResult = parseResult[0]
        if (!parseResult.N) {
          callback(refinedResult)
          return
        }
        parseResult = parseResult.N
        if (parseResult[0]) {// parse parts of speech and explanations
          refinedResult.definitions = []
          for (let definitionResult of parseResult) {
            const oneDefinition: any = {}
            if (!definitionResult.P) {
              oneDefinition.partOfSpeech = undefined
            } else {
              oneDefinition.partOfSpeech = definitionResult.P[0].U[0]
            }
            if (!definitionResult.Q) {
              oneDefinition.explanations = undefined
            } else {
              oneDefinition.explanations = []
              definitionResult = definitionResult.Q
              let oneExplanation = {
                content: '',
                example: {
                  sentence: '',
                  content: ''
                }
              }
              for (const iStr in definitionResult) {
                const i = Number.parseInt(iStr, 10)
                if (typeof definitionResult[i] === 'string') {
                  // appendix of the last explanation
                  oneExplanation.content += definitionResult[i]
                } else if (typeof definitionResult[i] === 'object') {
                  // end of the last explanation, with potential example
                  oneExplanation.content += definitionResult[i]._
                  oneExplanation.example.sentence = definitionResult[i].T[0].W[0]
                  oneExplanation.example.content = definitionResult[i].T[0].X[0]
                  oneDefinition.explanations.push(oneExplanation)
                  oneExplanation = {
                    content: '',
                    example: {
                      sentence: '',
                      content: ''
                    }
                  }
                } else {
                  // Error, stop parsing
                  break
                }
              }
              if (typeof definitionResult[definitionResult.length - 1] === 'string') {
                oneDefinition.explanations.push(oneExplanation)
              }
            }
            refinedResult.definitions.push(oneDefinition)
          }
        }

        callback(refinedResult)
      })
    } catch (e) {
      debug('parse XML error !> %s', e)
    }
  }

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
      if (err) {
        callback({ found: false })
        return
      }
      if ((!rows) || rows.length === 0) {
        callback({ found: false })
        return
      }

      LingoesDict.contentToObject(rows[0].content, (pattern) => {
        debug('raw content object from sqlite: %s -> %o', word, pattern)

        callback({
          found: true,
          word,
          content: pattern
        })
      })
    })
  }

  public close () {
    if (this.db) this.db.close()
  }
}
