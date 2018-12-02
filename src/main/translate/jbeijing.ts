import * as fs from "fs";
import * as path from "path";
import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import logger from "../../common/logger";

export default class JBeijingAdapter implements Yagt.Translator {
  private config: Yagt.Config.JBeijing;
  private jb: JBeijing;

  constructor(config: Yagt.Config.JBeijing) {
    this.config = config;
    this.jb = new JBeijing(config.path);
    this.jb.loadUserDic(config.dictPath);
  }

  translate(text: string, callback: (translation: string) => void): void {
    this.jb.translate(
      text,
      this.config.traditionalChinese ? 950 : 936,
      translation => {
        callback(translation);
      }
    );
  }

  isEnable(): boolean {
    return this.config.enable;
  }
  setEnable(isEnable: boolean): void {
    this.config.enable = isEnable;
  }
  getName(): string {
    return "JBeijing";
  }
}

class JBeijing {
  static readonly DICT_PATH = "dict\\jb\\";

  // REFERENCE: Viusal Novel Reader jbjct.py
  static readonly TEXT_BUFFER_SIZE = 3000;
  // Magic number! See WideCharToMultiByte used by DJC_OpenAllUserDic_Unicode in JBJCT.dll
  // First call: ESI
  // Second call: ESI + 0x408
  // Third call: ESI + 0x810
  static readonly USERDIC_PATH_SIZE = 0x408; // sizeof(char)
  static readonly MAX_USERDIC_COUNT = 3; // maximum number of user-defined dic
  static readonly USERDIC_BUFFER_SIZE =
    2 * JBeijing.USERDIC_PATH_SIZE * JBeijing.MAX_USERDIC_COUNT; // 1548, sizeof(char)

  private exePath: string;
  private jbjct!: any;
  private outBuffer!: Buffer;
  private bufBuffer!: Buffer;
  private bufferSize = ref.alloc(ref.types.int, JBeijing.TEXT_BUFFER_SIZE);
  private userdicBuffer: Buffer | undefined;

  constructor(exePath: string) {
    this.exePath = exePath;
    this.checkExePathAndThrow();
    this.checkAndMakeDictDir();
    process.env.PATH += `;${exePath}`;
    this.initializeJbjct();
  }

  private checkExePathAndThrow() {
    if (!fs.existsSync(path.join(this.exePath, "JBJCT.dll"))) {
      logger.error(
        `jbeijing: there is no jbeijing translator in path ${
          this.exePath
        }. abort.`
      );
      throw new Error();
    }
  }

  private checkAndMakeDictDir() {
    if (!fs.existsSync(JBeijing.DICT_PATH)) {
      fs.mkdirSync(JBeijing.DICT_PATH);
      logger.warn("jbeijing: user dict path not exists. mkdir.");
    }
  }

  private initializeJbjct() {
    this.jbjct = ffi.Library("JBJCT.dll", {
      JC_Transfer_Unicode: [
        "int",
        [
          "uint",
          "uint",
          "uint",
          "int",
          "int",
          ref.types.CString,
          ref.types.CString,
          ref.refType(ref.types.int),
          ref.types.CString,
          ref.refType(ref.types.int)
        ]
      ],
      DJC_OpenAllUserDic_Unicode: ["int", [ref.types.CString, "int"]],
      DJC_CloseAllUserDic: ["void", ["int"]]
    });
  }

  private initializeBuffers() {
    this.outBuffer = Buffer.alloc(JBeijing.TEXT_BUFFER_SIZE * 2);
    this.bufBuffer = Buffer.alloc(JBeijing.TEXT_BUFFER_SIZE * 2);
  }

  loadUserDic(path?: string) {
    if (!path) {
      path = JBeijing.DICT_PATH;
    }
    this.makeUserdicBuffer(path);
    let statusCode = this.jbjct.DJC_OpenAllUserDic_Unicode(
      this.userdicBuffer,
      0
    );
    if (statusCode === 1 || statusCode === -255) {
      console.info("jbeijing: user dict loaded");
    } else {
      console.error("jbeijing: cannot load user dict. abort.");
      throw new Error();
    }
  }

  private makeUserdicBuffer(basePath: string) {
    this.userdicBuffer = Buffer.alloc(JBeijing.USERDIC_BUFFER_SIZE, 0);
    let userdicPaths = this.findAvailableUserdicPaths(basePath);
    for (let i in userdicPaths) {
      if (parseInt(i) >= JBeijing.MAX_USERDIC_COUNT) break;
      if (userdicPaths[i].length > JBeijing.USERDIC_PATH_SIZE / 2) {
        console.warn(`jbeijing: user dict path is to long: ${userdicPaths[i]}`);
        continue;
      }
      userdicPaths[i] = path.join(userdicPaths[i], "Jcuser");
      this.userdicBuffer.write(
        userdicPaths[i],
        JBeijing.USERDIC_PATH_SIZE * parseInt(i),
        JBeijing.USERDIC_PATH_SIZE,
        "ucs2"
      );
    }
    logger.debug(`jbeijing: trying to load user dict from: `);
    logger.debug(userdicPaths);
  }

  private findAvailableUserdicPaths(basePath: string): string[] {
    let paths: string[] = [];
    this.walk(basePath, paths);
    return paths;
  }

  private walk(basePath: string, out: string[]) {
    let dirList = fs.readdirSync(basePath);
    dirList.forEach(item => {
      if (
        fs.statSync(path.join(basePath, item)).isFile() &&
        item.toLowerCase() === "jcuser.dic"
      ) {
        out.push(basePath);
      }
    });

    dirList.forEach(item => {
      if (fs.statSync(path.join(basePath, item)).isDirectory()) {
        this.walk(path.join(basePath, item), out);
      }
    });
  }

  translate(
    text: string,
    destCodePage: number,
    callback: (translation: string) => void
  ): void {
    this.initializeBuffers();
    this.jbjct.JC_Transfer_Unicode.async(
      0,
      932,
      destCodePage,
      1,
      1,
      Buffer.from(`${text}\0`, "ucs2"),
      this.outBuffer,
      ref.ref(this.bufferSize),
      this.bufBuffer,
      ref.ref(this.bufferSize),
      () => {
        callback(ref.reinterpretUntilZeros(this.outBuffer, 2).toString("ucs2"));
      }
    );
  }
}
