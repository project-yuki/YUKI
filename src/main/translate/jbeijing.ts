import * as ffi from 'ffi'
import * as fs from 'fs'
import * as path from 'path'
import * as ref from 'ref'
const debug = require('debug')('yagt:jbeijing')

export default class JBeijing {
  public static readonly DICT_PATH = 'lib\\dict\\jb\\'

  // REFERENCE: Viusal Novel Reader jbjct.py
  public static readonly TEXT_BUFFER_SIZE = 3000
  // Magic number! See WideCharToMultiByte used by DJC_OpenAllUserDic_Unicode in JBJCT.dll
  // First call: ESI
  // Second call: ESI + 0x408
  // Third call: ESI + 0x810
  public static readonly USERDIC_PATH_SIZE = 0x408 // sizeof(char)
  public static readonly MAX_USERDIC_COUNT = 3 // maximum number of user-defined dic
  public static readonly USERDIC_BUFFER_SIZE =
    2 * JBeijing.USERDIC_PATH_SIZE * JBeijing.MAX_USERDIC_COUNT // 1548, sizeof(char)

  private exePath: string
  private jbjct!: any
  private outBuffer!: Buffer
  private bufBuffer!: Buffer
  private bufferSize = ref.alloc(ref.types.int, JBeijing.TEXT_BUFFER_SIZE)
  private userdicBuffer: Buffer | undefined

  constructor (exePath: string) {
    this.exePath = exePath
    try {
      this.checkExePathAndThrow()
      this.checkAndMakeDictDir()
      process.env.PATH += `;${exePath}`
      this.initializeJbjct()
    } catch (e) {
      return
    }
  }

  public loadUserDic (dicPath?: string) {
    if (!dicPath) {
      dicPath = JBeijing.DICT_PATH
    }
    this.makeUserdicBuffer(dicPath)
    const statusCode = this.jbjct.DJC_OpenAllUserDic_Unicode(
      this.userdicBuffer,
      0
    )
    if (statusCode === 1 || statusCode === -255) {
      debug('user dict loaded')
    } else {
      debug('cannot load user dict. abort')
    }
  }

  public async translate (text: string, destCodePage: number) {
    return new Promise<string>((resolve) => {
      this.initializeBuffers()
      this.jbjct.JC_Transfer_Unicode.async(
        0,
        932,
        destCodePage,
        1,
        1,
        Buffer.from(`${text}\0`, 'ucs2'),
        this.outBuffer,
        ref.ref(this.bufferSize),
        this.bufBuffer,
        ref.ref(this.bufferSize),
        () => {
          resolve(
            ref.reinterpretUntilZeros(this.outBuffer, 2).toString('ucs2')
          )
        }
      )
    })
  }

  private checkExePathAndThrow () {
    if (!fs.existsSync(path.join(this.exePath, 'JBJCT.dll'))) {
      debug('there is no jbeijing translator in path %s. abort', this.exePath)
      throw new Error()
    }
  }

  private checkAndMakeDictDir () {
    if (!fs.existsSync(JBeijing.DICT_PATH)) {
      debug('user dict path not exists. ignore')
    }
  }

  private initializeJbjct () {
    this.jbjct = ffi.Library('JBJCT.dll', {
      JC_Transfer_Unicode: [
        'int',
        [
          'uint',
          'uint',
          'uint',
          'int',
          'int',
          ref.types.CString,
          ref.types.CString,
          ref.refType(ref.types.int),
          ref.types.CString,
          ref.refType(ref.types.int)
        ]
      ],
      DJC_OpenAllUserDic_Unicode: ['int', [ref.types.CString, 'int']],
      DJC_CloseAllUserDic: ['void', ['int']]
    })
  }

  private initializeBuffers () {
    this.outBuffer = Buffer.alloc(JBeijing.TEXT_BUFFER_SIZE * 2)
    this.bufBuffer = Buffer.alloc(JBeijing.TEXT_BUFFER_SIZE * 2)
  }

  private makeUserdicBuffer (basePath: string) {
    this.userdicBuffer = Buffer.alloc(JBeijing.USERDIC_BUFFER_SIZE, 0)
    const userdicPaths = this.findAvailableUserdicPaths(basePath)
    for (let i = 0; i < userdicPaths.length; i++) {
      if (i >= JBeijing.MAX_USERDIC_COUNT) break
      if (userdicPaths[i].length > JBeijing.USERDIC_PATH_SIZE / 2) {
        debug("user dict path is to long: %s. didn't load it", userdicPaths[i])
        continue
      }
      userdicPaths[i] = path.join(userdicPaths[i], 'Jcuser')
      this.userdicBuffer.write(
        userdicPaths[i],
        JBeijing.USERDIC_PATH_SIZE * i,
        JBeijing.USERDIC_PATH_SIZE,
        'ucs2'
      )
    }
    debug('trying to load user dict from %O', userdicPaths)
  }

  private findAvailableUserdicPaths (basePath: string): string[] {
    const paths: string[] = []
    this.walk(basePath, paths)
    return paths
  }

  private walk (basePath: string, out: string[]) {
    const dirList = fs.readdirSync(basePath)
    dirList.forEach((item) => {
      if (
        fs.statSync(path.join(basePath, item)).isFile() &&
        item.toLowerCase() === 'jcuser.dic'
      ) {
        out.push(basePath)
      }
    })

    dirList.forEach((item) => {
      if (fs.statSync(path.join(basePath, item)).isDirectory()) {
        this.walk(path.join(basePath, item), out)
      }
    })
  }
}
