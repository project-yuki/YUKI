import { exec } from "child_process";
const debug = require("debug")("yagt:game");
import configManager from "./config";
import { registerProcessExitCallback } from "./win32";
import hooker from "./hooker";
import { EventEmitter } from "events";
import TextInterceptor from "./textInterceptor";

export default class Game extends EventEmitter {
  private static readonly TIMEOUT = 1000;
  private static readonly MAX_RESET_TIME = 10;
  private execString: string;
  private path: string;
  private code: string;
  private pid: number;
  private name: string;
  private localeChanger: string;
  private exeName: string;

  constructor(game: Yagt.Game) {
    super();
    this.path = game.path;
    this.execString = "";
    this.pid = -1;
    this.code = game.code;
    this.name = game.name;
    this.localeChanger = game.localeChanger;
    this.exeName = "";
  }

  start() {
    this.execGameProcess();
    this.registerHookerWithPid();
  }

  private execGameProcess() {
    this.getRawExecStringOrDefault();
    this.replaceExecStringTokensWithActualValues();
    debug("exec string: %s", this.execString);
    exec(this.execString);
  }

  private getRawExecStringOrDefault() {
    const localeChangers: Yagt.Config.Default["localeChangers"] = configManager
      .getInstance()
      .get("default").localeChangers;
    if (this.localeChanger) {
      debug(
        "choose %s as locale changer",
        localeChangers[this.localeChanger].name
      );
      this.execString = localeChangers[this.localeChanger].exec;
      return;
    }
    debug("no locale changer chosed. use %GAME_PATH%");
    this.execString = "%GAME_PATH%";
  }

  private replaceExecStringTokensWithActualValues() {
    this.execString = this.execString.replace("%GAME_PATH%", `"${this.path}"`);
  }

  private async registerHookerWithPid() {
    this.exeName = this.path.substring(this.path.lastIndexOf("\\") + 1);
    debug("finding pid of %s...", this.exeName);
    try {
      await this.findPid();
    } catch (e) {
      debug("could not find game %s. abort", this.exeName);
      this.emit("exited");
      return;
    }
    this.injectProcessByPid();
    this.emit("started", this);
    this.registerProcessExitCallback();
  }

  private findPid() {
    return new Promise((resolve, reject) => {
      let retryTimes = 0;
      let pidGetterInterval = setInterval(() => {
        exec(
          `tasklist /nh /fo csv /fi "imagename eq ${this.exeName}"`,
          (err, stdout, stderr) => {
            if (retryTimes >= Game.MAX_RESET_TIME) {
              clearInterval(pidGetterInterval);
              reject();
            }
            if (this.findsPidIn(stdout)) {
              clearInterval(pidGetterInterval);
              this.pid = this.parsePidFrom(stdout);
              debug("found game. pid %d", this.pid);
              resolve();
            } else {
              retryTimes++;
              debug("could not find game. retry times...", retryTimes);
            }
          }
        );
      }, Game.TIMEOUT);
    });
  }

  private findsPidIn(value: string) {
    return value.startsWith('"');
  }

  private parsePidFrom(value: string) {
    return parseInt(value.replace(/"/g, "").split(",")[1]);
  }

  private injectProcessByPid() {
    hooker.getInstance().injectProcess(this.pid);
  }

  private registerProcessExitCallback() {
    registerProcessExitCallback(this.pid, () => {
      this.pid = -1;
      this.emit("exited", this);
    });
  }

  getPid() {
    return this.pid;
  }

  getInfo(): Yagt.Game {
    return {
      name: this.name,
      code: this.code,
      path: this.path,
      localeChanger: this.localeChanger
    };
  }
}
